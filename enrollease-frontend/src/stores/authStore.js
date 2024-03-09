import { defineStore } from 'pinia';
import { router } from '@/helpers/router';
import axios from 'axios';



export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: JSON.parse(localStorage.getItem('token')) || null,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        api_uri: import.meta.env.VITE_API_URL,
        clientId: import.meta.env.VITE_CLIENT_ID,
        returnUrl: null
    }),
    actions: {
        async login(code) {
            try {
                localStorage.setItem('gCode', JSON.stringify(code))

                const { data } = await axios.post(
                    'https://oauth2.googleapis.com/token',
                    {
                        code,
                        client_id: import.meta.env.VITE_CLIENT_ID,
                        client_secret: import.meta.env.VITE_CLIENT_SECRET,
                        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
                        grant_type: 'authorization_code',
                    },
                )

                if (data) {
                    const accessToken = data.access_token

                    // Fetch user details using the access token
                    const userObj = await axios.get(
                        'https://www.googleapis.com/oauth2/v3/userinfo',
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        },
                    )

                    if (userObj && userObj.data) {
                        const is_allowed = await axios.get(
                            import.meta.env.VITE_API_URL + 'admin/colleagues/is_allowed?email=' + userObj.data.email,
                            {
                                headers: {
                                    Authorization: `Bearer ${data.id_token}`,
                                },
                            },
                        )
                        if (!is_allowed) {
                            logout();
                        }
                        // save copy in storage
                        this.$patch({ user: userObj.data, token: data.id_token });
                        localStorage.setItem('user', JSON.stringify(userObj.data))
                        localStorage.setItem('token', JSON.stringify(this.token))
                        router.push(this.returnUrl || '/');
                    }
                    else {
                        // Handle the case where userResponse or userResponse.data is undefined
                        console.error('Failed to fetch user data')
                    }
                }
            }
            catch (e) {
                console.error('Failed to exchaange token', e)
            }
        },
        logout() {
            this.$patch({ user: null, token: null });
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('gCode')
            router.push('/login')
        }
    }
});