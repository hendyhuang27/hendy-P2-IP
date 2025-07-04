module.exports = {
    apps: [{
        name: "Music App",
        script: "server.js",
        env: {
            DATABASE_URL: "postgresql://postgres.wrxzagogwnyswohzrmgm:TN2O5bGGDTHWa73r@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
            DB_HOST: "aws-0-ap-southeast-1.pooler.supabase.com",
            DB_USER: "postgres.wrxzagogwnyswohzrmgm",
            DB_PASSWORD: "TN2O5bGGDTHWa73r",
            DB_NAME: "postgres",
            DB_PORT: "5432",
            RAPIDAPI_KEY: "1a7915ff35msh6e67181c69641c7p175794jsn049299f46d27",
            GEMINI_API_KEY: "AIzaSyDNXg4MmNlFlPrV2sY43Qcn-__i1GCT4iE",
            GOOGLE_CLIENT_ID: "736339998662-l40a4qkhbf2lc1f3ed0uhc2suqt65brr.apps.googleusercontent.com",
            JWT_SECRET: "hendy_super_secret_jwt_key_for_music_app_2024_very_long_and_secure",
            PORT: "5000",
            NODE_ENV: "development",
            DEEZER_API_URL: "https://api.deezer.com"
        },
    }]
}