# Node Simple Server Functions

A way to publish your nodejs module functions to be accessed in a Restful API

## Getting Started

To get started clone this repository and install all the dependencies.
And the run start to starting up the server.

```bash
  git clone https://github.com/xvicmanx/node-simple-server-functions
  npm install
  npm start
```

Then in another terminal run the following: 

```bash
  npm run push -- --dir ./projects/foo/ --funcName foo --host http://localhost:3000 --httpMethod post

  npm run push -- --dir ./projects/bar/ --funcName bar --host http://localhost:3000
```

Finally in that terminal run:

```bash
  curl http://localhost:3000/foo?name=John -X POST
  curl http://localhost:3000/bar
```
This will return: 

`Hello from helpers John`

`This is bar`

## Contributing

Feel free to make any suggestion to improve this project.


## Authors

See the list of [contributors](https://github.com/xvicmanx/node-simple-server-functions/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
