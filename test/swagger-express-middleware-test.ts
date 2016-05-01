import * as middleware from 'swagger-express-middleware';
import {Middleware, MemoryDataStore, Resource} from 'swagger-express-middleware';
import * as express from 'express';
import * as path from 'path';
import * as util from 'util';


// from sample1.js

let app = express();

middleware(path.join(__dirname, 'PetStore.yaml'), app, (err, middleware) => {
  app.use(
    middleware.metadata(),
    middleware.CORS(),
    middleware.files(),
    middleware.parseRequest(),
    middleware.validateRequest(),
    middleware.mock()
  );

  app.listen(8000, function() {
    console.log('The Swagger Pet Store is now running at http://localhost:8000');
  });
});

// from sample2.js

var middlewareInstance = new Middleware(app);
middlewareInstance.init(path.join(__dirname, 'PetStore.yaml'), err => {
  // Create a custom data store with some initial mock data
  var myDB = new MemoryDataStore();
  myDB.save(
    new Resource('/pets/Lassie', {name: 'Lassie', type: 'dog', tags: ['brown', 'white']}),
    new Resource('/pets/Clifford', {name: 'Clifford', type: 'dog', tags: ['red', 'big']}),
    new Resource('/pets/Garfield', {name: 'Garfield', type: 'cat', tags: ['orange']}),
    new Resource('/pets/Snoopy', {name: 'Snoopy', type: 'dog', tags: ['black', 'white']}),
    new Resource('/pets/Hello%20Kitty', {name: 'Hello Kitty', type: 'cat', tags: ['white']})
  );



  // Enable Express' case-sensitive and strict options
  // (so "/pets/Fido", "/pets/fido", and "/pets/fido/" are all different)
  app.enable('case sensitive routing');
  app.enable('strict routing');

  app.use(middlewareInstance.metadata());
  app.use(middlewareInstance.files(
    {
      // Override the Express App's case-sensitive and strict-routing settings
      // for the Files middleware.
      caseSensitive: false,
      strict: false
    },
    {
      // Serve the Swagger API from "/swagger/api" instead of "/api-docs"
      apiPath: '/swagger/api',

      // Disable serving the "PetStore.yaml" file
      rawFilesPath: false
    }
  ));

  app.use(middlewareInstance.parseRequest(
    {
      // Configure the cookie parser to use secure cookies
      cookie: {
        secret: 'MySuperSecureSecretKey'
      },

      // Don't allow JSON content over 100kb (default is 1mb)
      json: {
        limit: '100kb'
      },

      // Change the location for uploaded pet photos (default is the system's temp directory)
      multipart: {
        dest: path.join(__dirname, 'photos')
      }
    }
  ));

  // These two middleware don't have any options (yet)
  app.use(
    middlewareInstance.CORS(),
    middlewareInstance.validateRequest()
  );

  // Add custom middleware
  app.patch('/pets/:petName', function(req, res, next) {
    if (req.body.name !== req.params.petName) {
      // The pet's name has changed, so change its URL.
      // Start by deleting the old resource
      myDB.delete(new Resource(req.path), function(err, pet) {
        if (pet) {
          // Merge the new data with the old data
          pet.merge(req.body);
        }
        else {
          pet = req.body;
        }

        // Save the pet with the new URL
        myDB.save(new Resource('/pets', req.body.name, pet), function(err, pet) {
          // Send the response
          res.json(pet.data);
        });
      });
    }
    else {
      next();
    }
  });

  // The mock middleware will use our custom data store,
  // which we already pre-populated with mock data
  app.use(middlewareInstance.mock(myDB));

  // Add a custom error handler that returns errors as HTML
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status);
    res.type('html');
    res.send(util.format('<html><body><h1>%d Error!</h1><p>%s</p></body></html>', err.status, err.message));
  });

  app.listen(8000, function() {
    console.log('The Swagger Pet Store is now running at http://localhost:8000');
  });
});
