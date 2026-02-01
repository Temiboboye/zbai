import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // TODO: Replace with actual backend API call
                // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, { ... })

                // Temporary Mock Logic matching existing setup
                const mockUsers = [
                    {
                        id: "1",
                        email: "demo@zerobounce.ai",
                        password: "demo123",
                        name: "Demo User",
                        credits: 142500
                    }
                ];

                const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);

                if (user) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: null,
                    };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
        signOut: '/login', // Redirect to login after sign out
        error: '/login',   // Error code passed in query string as ?error=
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                // Attach custom user properties to session if needed
                // session.user.id = token.sub; 
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
