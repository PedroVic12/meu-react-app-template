// --- Page Components ---

import { Box, Typography, IconButton, Button, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { useToast } from "../../App";

//import BottomSheet from "../widgets/BottomSheet_widget";


// --- BottomSheet Component ---
interface BottomSheetProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const bottomSheetStyle = {
    position: 'absolute' as 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    bgcolor: 'background.paper',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    boxShadow: 24,
    p: 3,
    maxHeight: '70vh',
    overflowY: 'auto',
};

const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose, title, children }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="bottom-sheet-title"
            aria-describedby="bottom-sheet-description"
        >
            <Box sx={bottomSheetStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography id="bottom-sheet-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box id="bottom-sheet-description">
                    {children}
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button onClick={onClose} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
// --- End 


// HomePage
const HomePage: React.FC = () => {
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const { addToast } = useToast();

    const handleOpenBottomSheet = () => setBottomSheetOpen(true);
    const handleCloseBottomSheet = () => setBottomSheetOpen(false);

    const showSuccessToast = () => addToast('Operation successful!', 'success');
    const showErrorToastWithAction = () => {
        addToast('Something went wrong!', 'error', (
            <Button color="inherit" size="small" onClick={() => alert('Retry action clicked!')}>
                RETRY
            </Button>
        ));
    };

    return (
        <Box className="p-16 flex justify-center">
            <Typography variant="h4" gutterBottom>Home Page</Typography>
            <Typography paragraph>Welcome to the mobile app template 2025.</Typography>
            <Typography paragraph>From Pedro Victor Veras Software developer.</Typography>

            <Typography paragraph>Use the buttons below to interact with the app.</Typography>

            <Typography paragraph>Estou usando esse template para migrar um projeto em Flutter para React com Ionic para React com Vite e com todos os componentes com codigo limpo usando Material UI, Tailiwind e Ionic</Typography>


            <Button variant="contained" onClick={handleOpenBottomSheet} className="mb-4">
                Open Bottom Sheet
            </Button>
            <Box className="space-x-2">
                <Button variant="outlined" color="success" onClick={showSuccessToast}>Show Success Toast</Button>
                <Button variant="outlined" color="error" onClick={showErrorToastWithAction}>Show Error Toast with Action</Button>
            </Box>
            <BottomSheet open={bottomSheetOpen} onClose={handleCloseBottomSheet} title="Example Bottom Sheet">
                <Typography paragraph>This is the bottom sheet content.</Typography>
                <Typography paragraph>It scrolls if needed. Lorem ipsum...</Typography>
                <Button variant="contained" onClick={handleCloseBottomSheet} className="mt-4">Confirm Action</Button>
            </BottomSheet>
        </Box>
    );
};


export default HomePage;