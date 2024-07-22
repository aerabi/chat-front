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
$ ng generate service chat
```
