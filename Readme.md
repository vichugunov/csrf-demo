# Preparation
1. `brew install openssl`
2. `cd app`
3. `openssl req -nodes -new -x509 -keyout server.key -out server.cert`
Do not forget to put `localhost` when asked for:
> Common Name (eg, fully qualified host name) []: localhost
4. create .env file like in sample