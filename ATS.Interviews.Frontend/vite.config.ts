import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        proxy: { // set proxies to redirect requests to the backend services based on process environment variables passed by Aspire 
            '/api/interview': {
                target: process.env.services__atsinterviewsapi__https__0 || process.env.services__atsinterviewsapi__http__0,
                secure: false
            },
            '/api/candidate': {
                target: process.env.services__atsinterviewsapi__https__0 || process.env.services__atsinterviewsapi__http__0,
                secure: false
            },
            '/api/feedback': {
                target: process.env.services__atsinterviewsapi__https__0 || process.env.services__atsinterviewsapi__http__0,
                secure: false
            },
            '/api/interviewer': {
                target: process.env.services__atsinterviewsapi__https__0 || process.env.services__atsinterviewsapi__http__0,
                secure: false
            },
            '/api/interviewtemplate': {
                target: process.env.services__atsinterviewsapi__https__0 || process.env.services__atsinterviewsapi__http__0,
                secure: false
            },
            '/api/section': {
                target: process.env.services__atsinterviewsapi__https__0 || process.env.services__atsinterviewsapi__http__0,
                secure: false
            }
        },
        port: parseInt(process.env.PORT || "52557"), // use port from process variable passed by Aspire or fallback to 52557
    }
})
