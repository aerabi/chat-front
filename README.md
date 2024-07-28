# ChatFront

This is the front-end of [the chat application](https://github.com/aerabi/chat), built with Angular version 18.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Project creation

This project was generated with Angular CLI version 18.1.1. To install the CLI, run:

```bash
$ npm install -g @angular/cli
```

Delete the placeholder code in `src/app/app.component.html` and replace it with the following:

```html
<h1>Hello, chat-front</h1>
<router-outlet />
```

Then run the application to make sure everything is working:

```bash
$ ng serve
```

And then run the tests:

```bash
$ ng test
```


### Create the chat component

Create a new component called `chat`:

```bash
$ ng generate component chat
```

And then add it to the main application component, `src/app/app.component.html`:

```html
<h1>Hello, chat-front</h1>
<app-chat></app-chat>
<router-outlet />
```

So far so good. Now let's add some functionality to the chat component. To do that, let's 
create a service that will handle the chat messages.

### Create the chat service

Create a new service called `chat`:

```bash
$ ng generate service chat/chat
```

There, we need to add the following functionality to the service:

- A method to register the current user
- A method to get the chat messages
- A method to add a chat message

### Create the types

Create a new file called `chat.types.ts` in the `src/app/chat` directory:

```typescript
export interface User {
  id: string | number;
  name: string;
}

export interface Message {
  id: string | number;
  text: string;
  userId: string | number;
}

export interface Chat {
  id: string | number;
  users: User[];
  messages: Message[];
}
```

Now, let's add the functionality to the service. We're going to use `axios` to make HTTP requests to the back-end. So, let's install it:

```bash
$ npm install axios
```

And then add the following code to the service:

```typescript
import { Injectable } from '@angular/core';
import { Chat, Message, User } from './chat.types';
import axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor() {
  }

  async registerUser(name: string): Promise<User> {
    const data = { name };
    const response = await axios.post<User>(`/users`, data);
    return response.data;
  }
}
```

The service assumes that the back-end is running on the same host as the front-end. To test it, we need to make it happen.
The backend code is available as a Docker image tagged `aerabi/chat-back:latest`. We'll use this image to create the following `docker-compose.yml` file:

```yaml
services:
  frontend:
    build:
      context: "."
      dockerfile: "Dockerfile"
    networks:
      - chat_net
  backend:
    image: aerabi/chat-backend:latest
    networks:
      - chat_net
  proxy:
    image: nginx:stable-alpine
    environment:
      - NGINX_ENVSUBST_TEMPLATE_SUFFIX=.conf
      - NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx
    volumes:
      - ${PWD}/nginx.conf:/etc/nginx/templates/nginx.conf.conf
    ports:
      - 80:80
    networks:
      - chat_net

networks:
  chat_net:
```

We need a Docker image for the frontend as well to make this setup work:

```Dockerfile
# Builder container to compile the application
FROM node:22.5-alpine as builder
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
RUN npm run build

# Production container with the static files
FROM nginx:stable-alpine as production

COPY --from=builder /usr/src/app/dist/chat-front/browser /usr/share/nginx/html
COPY nginx.frontend.conf /etc/nginx/nginx.conf

EXPOSE 80
```

And the `nginx.frontend.conf` file:

```nginx
events {}
http {
    include /etc/nginx/mime.types;
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

And finally, the `nginx.conf` file for the load balancer:

```nginx
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log debug;

events {}
http {
  server {
    listen 80;
    location / {
      # Route root to frontend
      error_page 404 /;
      proxy_intercept_errors on;
      proxy_set_header Host              $host;
      proxy_set_header X-Real-IP         $remote_addr;
      proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host  $host;
      proxy_set_header X-Forwarded-Port  $server_port;
      proxy_pass http://frontend:80/;
    }
    location ~ ^/(users|sessions) {
      # Route other requests to api server
      proxy_set_header Host              $host;
      proxy_set_header X-Real-IP         $remote_addr;
      proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-Host  $host;
      proxy_set_header X-Forwarded-Port  $server_port;
      include uwsgi_params;
      proxy_pass http://backend:3000;
    }
  }
}
```

Now, let's build and run the application:

```bash
$ docker compose up --build
```
