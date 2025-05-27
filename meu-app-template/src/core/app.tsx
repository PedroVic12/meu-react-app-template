







// --- Main App Component ---
const App = () => (
    <DarkModeProvider>
        <SessionProvider>
            <ToastProvider>
                <BrowserRouter>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/workout" element={<WorkoutPage />} />

                            
                            {/* <Route path="/agenda" element={<AgendaContatosPage />} /> */}

                            <Route path="/stock-manager" element={<StockManagerpage />} /> 
                            {/* <Route path="/lembrete_app" element={<LembreteApp />} /> */}

                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </MainLayout>
                </BrowserRouter>
            </ToastProvider>
        </SessionProvider>
    </DarkModeProvider>
);

export default App;
