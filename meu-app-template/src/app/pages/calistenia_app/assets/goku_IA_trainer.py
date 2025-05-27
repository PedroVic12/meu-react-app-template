import cv2
import numpy as np
import mediapipe as mp
import time
from typing import Dict, List, Tuple, Optional
import os

class PoseDetector:
    def __init__(self, video_sources: List[str], num_people: int = 1, focus_side: str = "direita", video_index: int = 0):
        """Initialize pose detector with a list of video sources."""
        self.mp_pose = mp.solutions.pose
        self.mp_draw = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5,
            model_complexity=1  # Reduzido para melhorar o FPS
        )

        # Lista de fontes de vídeo
        self.video_sources = video_sources
        self.video_index = video_index

        # Configuração do vídeo
        self.cap = None
        self.set_video_source(video_index)

        # Configuração inicial das dimensões (valores padrão para 16:9)
        self.frame_width = 1500  # Largura padrão
        self.frame_height = int(self.frame_width * 9 / 16)  # Altura proporcional

        self.num_people = num_people
        self.focus_side = focus_side
        self.start_time = time.time()
        self.frame_count = 0

    def set_video_source(self, index: int):
        """Configura a fonte de vídeo de acordo com o índice."""
        if index < 0 or index >= len(self.video_sources):
            raise ValueError("Índice de vídeo fora do intervalo.")
        self.video_index = index
        self.cap = cv2.VideoCapture(self.video_sources[index])
        if not self.cap.isOpened():
            raise RuntimeError(f"Não foi possível abrir o vídeo: {self.video_sources[index]}")

        # Atualizar as dimensões do vídeo
        self.frame_width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.frame_height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        # Ajustar para manter a proporção 16:9
        if self.frame_width / self.frame_height != 16 / 9:
            self.frame_height = int(self.frame_width * 9 / 16)

    def calculate_angle(self, point1: np.ndarray, point2: np.ndarray, point3: np.ndarray) -> float:
        """Calcula o ângulo entre três pontos."""
        a = np.array([point1.x, point1.y])
        b = np.array([point2.x, point2.y])
        c = np.array([point3.x, point3.y])

        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)

        if angle > 180.0:
            angle = 360 - angle

        return angle

    def get_pose_angles(self, landmarks) -> Dict[str, float]:
        """Calcula os ângulos principais da pose."""
        angles = {}

        if self.focus_side == "direita":
            print("pegando pessoa da direita...")
        else:
            print("pegando a pessoa na esquerda...")

        angles['right_elbow'] = self.calculate_angle(
            landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value],
            landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value],
            landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]
        )
        angles['right_knee'] = self.calculate_angle(
            landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP.value],
            landmarks[self.mp_pose.PoseLandmark.RIGHT_KNEE.value],
            landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value]
        )
        angles['left_elbow'] = self.calculate_angle(
            landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value],
            landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value],
            landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value]
        )
        angles['left_knee'] = self.calculate_angle(
            landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value],
            landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value],
            landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value]
        )

        return angles

    def draw_angles(self, image: np.ndarray, landmarks, angles: Dict[str, float]) -> np.ndarray:
        """Desenha os ângulos na imagem."""
        h, w = image.shape[:2]
        for joint, angle in angles.items():
            landmark_map = {
                'left_elbow': self.mp_pose.PoseLandmark.LEFT_ELBOW.value,
                'right_elbow': self.mp_pose.PoseLandmark.RIGHT_ELBOW.value,
                'left_knee': self.mp_pose.PoseLandmark.LEFT_KNEE.value,
                'right_knee': self.mp_pose.PoseLandmark.RIGHT_KNEE.value
            }

            if joint in landmark_map:
                landmark = landmarks[landmark_map[joint]]
                position = tuple(np.multiply([landmark.x, landmark.y], [w, h]).astype(int))
                joint_name = "Cotovelo Direito" if joint == 'right_elbow' else "Cotovelo Esquerdo" if joint == 'left_elbow' else "Joelho Direito" if joint == 'right_knee' else "Joelho Esquerdo"
                
                cv2.putText(image, f'{int(angle)}', position, cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        return image

    def black_box(self, frame, angles):
        """Adiciona caixa preta com informações dos ângulos no canto inferior esquerdo."""
        if angles:
            box_x = 0  # Posição X no inicio
            box_y = frame.shape[0] - 150  # Posição Y da caixa

            box_w = 350  # Largura da caixa
            box_h = 200  # Altura da caixa

            cv2.rectangle(frame, (box_x, box_y), (box_x + box_w, box_y + box_h), (0, 0, 0), -1)  # Caixa preta
            text = (f"Angulos detectados:\n\n"
                    f"Cotovelo Esquerdo: {int(angles.get('left_elbow', 'N/A'))} graus\n"
                    f"Cotovelo Direito: {int(angles.get('right_elbow', 'N/A'))} graus\n\n"
                    f"Joelho Esquerdo: {int(angles.get('left_knee', 'N/A'))} graus\n"
                    f"Joelho Direito: {int(angles.get('right_knee', 'N/A'))} graus")

            for i, line in enumerate(text.split('\n')):
                cv2.putText(frame, line, (box_x + 5, box_y + 20 + i * 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        return frame

    def process_frame(self) -> Optional[Tuple[np.ndarray, Dict[str, float]]]:
        """Processa um frame e retorna a imagem anotada com ângulos."""
        if not self.cap.isOpened():
            return None

        success, frame = self.cap.read()
        if not success:
            return None

        frame = cv2.resize(frame, (self.frame_width, self.frame_height))
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        rgb_frame.flags.writeable = False

        results = self.pose.process(rgb_frame)
        rgb_frame.flags.writeable = True
        frame = cv2.cvtColor(rgb_frame, cv2.COLOR_RGB2BGR)

        angles = {}
        if results.pose_landmarks:
            self.mp_draw.draw_landmarks(
                frame,
                results.pose_landmarks,
                self.mp_pose.POSE_CONNECTIONS,
                self.mp_draw.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                self.mp_draw.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
            )
            angles = self.get_pose_angles(results.pose_landmarks.landmark)
            frame = self.draw_angles(frame, results.pose_landmarks.landmark, angles)
            frame = self.black_box(frame, angles)  # Adiciona a caixa preta com ângulos

        self.frame_count += 1
        current_time = time.time()
        if current_time - self.start_time >= 1.0:
            fps = self.frame_count
            self.frame_count = 0
            self.start_time = current_time
            cv2.putText(frame, f'FPS: {fps}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        return frame, angles

    def release(self):
        """Libera os recursos."""
        self.cap.release()
        cv2.destroyAllWindows()

    def save_video(self, output_filename: str):
        """Salva os frames processados em um arquivo de vídeo .mp4."""
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Codec para .mp4
        out = cv2.VideoWriter(output_filename, fourcc, 20.0, (self.frame_width, self.frame_height))

        while True:
            frame_data = self.process_frame()
            if frame_data is None:
                break

            frame, angles = frame_data
            out.write(frame)  # Escreve o frame no arquivo de vídeo
            frame = cv2.resize(frame, (self.frame_width, self.frame_height))

            cv2.imshow("Pose Detection 2", frame)

            # Impressão dos ângulos
            if angles:
                print(f"Ângulos detectados - Cotovelo Esquerdo: {angles.get('left_elbow', 'N/A')}°, "
                      f"Cotovelo Direito: {angles.get('right_elbow', 'N/A')}°, "
                      f"Joelho Esquerdo: {angles.get('left_knee', 'N/A')}°, "
                      f"Joelho Direito: {angles.get('right_knee', 'N/A')}°")

            # Pressione 'q' para sair
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        out.release()  # Libera o VideoWriter
        self.release()  # Libera os recursos do vídeo

    def run(self):
        """Executa o detector e salva o vídeo."""
        output_filename = "cv2_video.mp4"
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Codec para .mp4
        out = cv2.VideoWriter(output_filename, fourcc, 20.0, (self.frame_width, self.frame_height))

        while True:
            frame_data = self.process_frame()
            if frame_data is None:
                break

            frame, angles = frame_data
            out.write(frame)  # Escreve o frame no arquivo de vídeo
            frame = cv2.resize(frame, (self.frame_width, self.frame_height))

            cv2.imshow("GOKU IA PERSONAL TRAINER V3", frame)

            # Impressão dos ângulos
            if angles:
                print(f"Ângulos detectados - Cotovelo Esquerdo: {angles.get('left_elbow', 'N/A')}°, "
                      f"Cotovelo Direito: {angles.get('right_elbow', 'N/A')}°, "
                      f"Joelho Esquerdo: {angles.get('left_knee', 'N/A')}°, "
                      f"Joelho Direito: {angles.get('right_knee', 'N/A')}°")

            # Pressione 'q' para sair
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        out.release()  # Libera o VideoWriter
        self.release()  # Libera os recursos do vídeo

# Lista de vídeos e execução do detector
files_path = "/home/pedrov12/Documentos/GitHub/mvp-projects-freelancer/pythonando/Computer_Vision/opencv_modules/modules/video_analyser_IA"
videos = [
    "/home/pedrov12/Documentos/GitHub/mvp-projects-freelancer/pythonando/Computer_Vision/opencv_modules/modules/video_analyser_IA/assets/datasets/mawashi_geri.mp4",
    "/home/pedrov12/Documentos/GitHub/mvp-projects-freelancer/pythonando/Computer_Vision/opencv_modules/modules/video_analyser_IA/assets/datasets/chute_dataset.mp4",
    "/home/pedrov12/Documentos/GitHub/mvp-projects-freelancer/pythonando/Computer_Vision/opencv_modules/modules/video_analyser_IA/assets/calistenia_1.mp4",
    0  # Webcam
]

detector = PoseDetector(video_sources=videos, focus_side="direita", video_index=0)  # Mudando para focar na pessoa da direita
detector.run()