// Type definitions for swagger-express-middleware 1.0.0-alpha.12
// Project: https://github.com/BigstickCarpet/swagger-express-middleware
// Definitions by: Qubo <https://github.com/tkqubo>
// Definitions: https://github.com/tkqubo/typed-swagger-express-middleware

import * as express from 'express';

/**
 * @param swagger The file path or URL of a Swagger 2.0 API spec, in YAML or JSON format. Or a valid Swagger object.
 * Any $ref pointers to other files/URLs will be interpreted as relative to the main Swagger file.
 * @param router An Express Application or Router that will be used to determine settings (such as case-sensitivity and strict routing) and to register path-parsing middleware.
 * @param callback A callback function that will be called once the Swagger API is fully parsed, dereferenced, and validated.
 * The second parameter is the Middleware object that was created.
 */
declare function middleware(swagger?: string|any, router?: middleware.interfaces.Router, callback?: (err: Error, middleware: middleware.Middleware) => void): void;
/**
 * @param router An Express Application or Router that will be used to determine settings (such as case-sensitivity and strict routing) and to register path-parsing middleware.
 * @param callback A callback function that will be called once the Swagger API is fully parsed, dereferenced, and validated.
 * The second parameter is the Middleware object that was created.
 */
declare function middleware(router?: middleware.interfaces.Router, callback?: (err: Error, middleware: middleware.Middleware) => void): void;
/**
 * @param callback A callback function that will be called once the Swagger API is fully parsed, dereferenced, and validated.
 * The second parameter is the Middleware object that was created.
 */
declare function middleware(callback?: (err: Error, middleware: middleware.Middleware) => void): void;

declare namespace middleware {
  /**
   * The Middleware class is the main class in Swagger Express Middleware.
   * It's role is simple: You give it a Swagger API, and it gives you Express middleware for that API.
   * You can create multiple Middleware instances if you need to work with more than one Swagger API.
   * Each Middleware instance is entirely isolated, so any Express middleware that is created by one instance will only know about its own Swagger API.
   */
  export class Middleware {
    /**
     * @param router An Express Application or Router that will be used to determine settings (such as case-sensitivity and strict routing) and to register path-parsing middleware.
     */
    constructor(router?: interfaces.Router);
    /**
     * Initializes the middleware with the given Swagger API. This method can be called again to re-initialize with a new or modified API.
     * @param swagger The file path or URL of a Swagger 2.0 API spec, in YAML or JSON format. Or a valid Swagger object.
     * Any $ref pointers to other files/URLs will be interpreted as relative to the main Swagger file.
     * @param callback A callback function that will be called once the Swagger API is fully parsed, dereferenced, and validated.
     * The second parameter is the same Middleware object.
     */
    init(swagger: string|any, callback: (err: Error, middleware: Middleware) => void): void;
    /** This method creates a new Mock middleware instance. */
    mock: interfaces.Mock;
    /** This method creates a new Metadata middleware instance. */
    metadata(router?: interfaces.Router): express.RequestHandler[];
    /** This method creates a new Parse Request middleware instance. */
    parseRequest: interfaces.ParseRequest;
    /** This method creates a new Validate Request middleware instance. */
    validateRequest(router?: interfaces.Router): express.RequestHandler[];
    /** This method creates a new CORS middleware instance. */
    CORS(): express.RequestHandler[];
    /** This method creates a new Files middleware instance. */
    files: interfaces.Files;
  }

  export namespace interfaces {
    type Router = express.Router|express.Application;
    export interface Mock {
      (router?: Router, dataStore?: DataStore): express.RequestHandler[];
      (dataStore?: DataStore): express.RequestHandler[];
    }
    export interface ParseRequest {
      //TODO: options should be typed
      (router?: Router, options?: any): express.RequestHandler[];
      (options?: any): express.RequestHandler[];
    }
    export interface ParseRequestOptions {
      /**
       * Cookie parser options
       * (see https://github.com/expressjs/cookie-parser#cookieparsersecret-options)
       */
      cookie: {
        secret: string|string[];
      };
      /**
       * JSON body parser options
       * (see https://github.com/expressjs/body-parser#bodyparserjsonoptions)
       */
      json: BodyParserOptions;
      /**
       * Plain-text body parser options
       * (see https://github.com/expressjs/body-parser#bodyparsertextoptions)
       */
      text: BodyParserTextOptions;
      /**
       * URL-encoded body parser options
       * (see https://github.com/expressjs/body-parser#bodyparserurlencodedoptions)
       */
      urlencoded: BodyParserUrlEncodedOptions;
      /**
       * Raw body parser options
       * (see https://github.com/expressjs/body-parser#bodyparserrawoptions)
       */
      raw: BodyParserRawOptions;
      /**
       * Multipart form data parser options
       * (see https://github.com/expressjs/multer#options)
       */
      multipart: MulterOptions;
    }

    export interface BodyParserOptions extends BodyParserRawOptions {
      /**
       * The reviver option is passed directly to JSON.parse as the second argument. You can find more information on this argument in the MDN documentation about JSON.parse.
       */
      receiver?: (key: string, value: any) => any;
      /**
       * When set to true, will only accept arrays and objects; when false will accept anything JSON.parse accepts. Defaults to true.
       */
      strict?: boolean;
      /**
       * The type option is used to determine what media type the middleware will parse. This option can be a function or a string.
       * If a string, type option is passed directly to the type-is library and this can be an extension name (like json), a mime type (like application/json), or a mime type with a wildcard (like * /* or * /json).
       * If a function, the type option is called as fn(req) and the request is parsed if it returns a truthy value. Defaults to application/json.
       */
      type?: string|string[]|((req: express.Request) => any);
    }

    export interface BodyParserTextOptions extends BodyParserRawOptions {
      /**
       * Specify the default character set for the text content if the charset is not specified in the Content-Type header of the request. Defaults to utf-8.
       */
      defaultCharset?: string;
      /**
       * The type option is used to determine what media type the middleware will parse. This option can be a function or a string.
       * If a string, type option is passed directly to the type-is library and this can be an extension name (like json), a mime type (like application/json), or a mime type with a wildcard (like *／* or *／json).
       * If a function, the type option is called as fn(req) and the request is parsed if it returns a truthy value. Defaults to application/json.
       */
      type?: string|string[]|((req: express.Request) => any);
    }

    export interface BodyParserUrlEncodedOptions extends BodyParserRawOptions {
      /**
       * The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
       * The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded.
       * For more information, please see the qs library.
       */
      extended?: boolean;
      /**
       * The parameterLimit option controls the maximum number of parameters that are allowed in the URL-encoded data.
       * If a request contains more parameters than this value, a 413 will be returned to the client. Defaults to 1000.
       */
      parameterLimit?: number;
      /**
       * The type option is used to determine what media type the middleware will parse. This option can be a function or a string.
       * If a string, type option is passed directly to the type-is library and this can be an extension name (like urlencoded), a mime type (like application/x-www-form-urlencoded), or a mime type with a wildcard (like *／x-www-form-urlencoded).
      If a function, the type option is called as fn(req) and the request is parsed if it returns a truthy value. Defaults to application/x-www-form-urlencoded.
       */
      type?: string|string[]|((req: express.Request) => any);
    }

    export interface BodyParserRawOptions {
      /**
       * When set to true, then deflated (compressed) bodies will be inflated; when false, deflated bodies are rejected. Defaults to true.
       */
      inflate?: boolean;
      /**
       * Controls the maximum request body size. If this is a number, then the value specifies the number of bytes;
       * if it is a string, the value is passed to the bytes library for parsing. Defaults to '100kb'.
       */
      limit?: number|string;
      /**
       * The type option is used to determine what media type the middleware will parse. This option can be a function or a string.
       * If a string, type option is passed directly to the type-is library and this can be an extension name (like bin), a mime type (like application/octet-stream), or a mime type with a wildcard (like *／* or application／*).
        * If a function, the type option is called as fn(req) and the request is parsed if it returns a truthy value. Defaults to application/octet-stream.
       */
      type?: string|string[]|((req: express.Request) => any);
      /**
       * The verify option, if supplied, is called as verify(req, res, buf, encoding), where buf is a Buffer of the raw request body and encoding is the encoding of the request.
       * The parsing can be aborted by throwing an error.
       */
      verify?: (req: express.Request, res: express.Response, buf: Buffer, encoding: string) => void;
    }

    export interface MulterOptions {
      /** Where to store the files */
      dest?: string;
      /** Where to store the files */
      storage?: string;
      /** Function to control which files are accepted */
      fileFilter?: (req: express.Request, file: any, callback: (err: Error, allowed: boolean) => void) => void;
      /** Limits of the uploaded data */
      limits?: number;
      putSingleFilesInArray?: boolean;

    }

    export interface Files {
      (router?: Router, options?: FilesOptions): express.RequestHandler[];
      (options?: FilesOptions): express.RequestHandler[];
    }

    export interface FilesOptions {
      /**
       * If set to true, then the apiPath and rawFilesPath will be prepended with the Swagger API's basePath.
       */
      useBasePath?: boolean;
      /**
       * The path that will serve the fully dereferenced Swagger API in JSON format.
       * This file should work with any third-party tools, even if they don't support YAML, $ref pointers, or mutli-file Swagger APIs.
       */
      apiPath?: string;
      /**
       * The path that will serve the raw Swagger API file(s).
       */
      rawFilesPath?: string;
    }

    export interface ResourceCallback {
      (err: Error, resource: Resource): void;
    }

    export interface ResourcesCallback {
      (err: Error, resources: Resource[]): void;
    }

    export interface DataStoreMethod {
      /**
       * @param resource The resource to be deleted.
       * @param callback An error-first callback. The second parameter is the Resource object, or array of Resource objects that were deleted.
       */
      (resource: Resource, callback?: ResourceCallback): void;
      /**
       * @param resource1 The resource to be deleted.
       * @param resource2 The resource to be deleted.
       * @param callback An error-first callback. The second parameter is the Resource object, or array of Resource objects that were deleted.
       */
      (resource1: Resource, resource2: Resource, callback?: ResourcesCallback): void;
      /**
       * @param resource1 The resource to be deleted.
       * @param resource2 The resource to be deleted.
       * @param resource3 The resource to be deleted.
       * @param callback An error-first callback. The second parameter is the Resource object, or array of Resource objects that were deleted.
       */
      (resource1: Resource, resource2: Resource, resource3: Resource, callback?: ResourcesCallback): void;
      /**
       * @param resource1 The resource to be deleted.
       * @param resource2 The resource to be deleted.
       * @param resource3 The resource to be deleted.
       * @param resource4 The resource to be deleted.
       * @param callback An error-first callback. The second parameter is the Resource object, or array of Resource objects that were deleted.
       */
      (resource1: Resource, resource2: Resource, resource3: Resource, resource4: Resource, callback?: ResourcesCallback): void;
      /**
       * @param resource1 The resource to be deleted.
       * @param resource2 The resource to be deleted.
       * @param resource3 The resource to be deleted.
       * @param resource4 The resource to be deleted.
       * @param resource5 The resource to be deleted.
       * @param callback An error-first callback. The second parameter is the Resource object, or array of Resource objects that were deleted.
       */
      (resource1: Resource, resource2: Resource, resource3: Resource, resource4: Resource, resource5: Resource, callback?: ResourcesCallback): void;
      /**
       * @param resource1 The resource to be deleted.
       * @param resource2 The resource to be deleted.
       * @param resource3 The resource to be deleted.
       * @param resource4 The resource to be deleted.
       * @param resource5 The resource to be deleted.
       * @param resource6 The resource to be deleted.
       * @param callback An error-first callback. The second parameter is the Resource object, or array of Resource objects that were deleted.
       */
      (resource1: Resource, resource2: Resource, resource3: Resource, resource4: Resource, resource5: Resource, resource6: Resource, callback?: ResourcesCallback): void;
      /**
       * @param resources The resources to be deleted.
       * @param callback An error-first callback. The second parameter is the Resource object, or array of Resource objects that were deleted.
       */
      (resources: Resource[], callback?: ResourcesCallback): void;
    }
  }

  /**
   * The Resource class represents a single REST resource in your API. If you are unfamiliar with RESTful API design, here is a good article on the topic.
   */
  export class Resource {
    /**
     * @param path The full resource path (such as "/pets/Fido").
     * The constructor will automatically split the path and set the collection and name properties accordingly.
     * @param data The resource's data. This can be any value that is serializable as JSON, such as a string, a number, an object, an array, etc.
     */
    constructor(path: string, data?: any);
    /**
     * @param collection The resource's collection path (such as "/pets").
     * @param name The resource's unique name within its collection (such as "/Fido").
     * @param data The resource's data. This can be any value that is serializable as JSON, such as a string, a number, an object, an array, etc.
     */
    constructor(collection: string, name: string, data: any);
    /**
     * The resource's collection path. This property can be an empty string, if the resource is at the root of your API.
     */
    collection: string;
    /**
     * The resource's unique name within its collection. This property cannot be an empty string.
     * It will always contain at least a single forward slash.
     */
    name: string;
    /**
     * The resource's data. This can be any value that is serializable as JSON.
     */
    data: any;
    /**
     * The date/time that the resource was first saved to a DataStore. This property is automatically set by the DataStore class.
     */
    createdOn: Date;
    /**
     * The date/time that the resource was last saved (or updated) in a DataStore. This property is automatically set by the DataStore class.
     */
    modifiedOn: Date;
    /**
     * The Resource class overrides the default Object.valueOf() method to return the full resource path (collection + name).
     * It also supports extra parameters to control case-sensitivity and optionally return only the collection name,
     * but these parameters should be considered a private API and should not be used.
     */
    valueOf(): string;
    /**
     *  The data to be merged. It can be any value that is serializable as JSON, such as a string, a number, an object, an array, etc.
     *  If it is another Resource object, then that resource's data will be merged.
     * @param other The data to be merged. It can be any value that is serializable as JSON, such as a string, a number, an object, an array, etc.
     * If it is another Resource object, then that resource's data will be merged.
     */
    merge(other: Resource|any): void;
    /**
     * Parses JSON data into Resource objects.
     * @param json The JSON data to be parsed. This JSON data must be one or more Resource objects that were serialized using JSON.stringify().
     * If the JSON is invalid, then an error will be thrown.
     * If the JSON is a single object, then a single Resource will be returned; otherwise, an array of Resource objects will be returned.
     */
    static parse(json: string): Resource;
  }

  /**
   * The Mock middleware uses DataStore classes to store its data,
   * and you can use the DataStore API to to add/modify/remove this mock data, which is very handy for demos and POCs.
   * Refer to the Mock middleware documentation to find out how to specify which DataStore class is used.
   * Refer to the Sample 2 walkthrough to see how to initialize the data store with data.
   */
  export abstract class DataStore {
    /**
     * Returns the specified resource from the data store
     * @param resource The resource path (such as "/pets/Fido") or the Resource object to be retrieved
     * @param callback An error-first callback. The second parameter is the requested Resource object, or undefined if no match was found.
     */
    get(resource: string|Resource, callback?: interfaces.ResourceCallback): void;

    /**
     * Saves the specified resource(s) to the data store. If any of the resources already exist, the new data is merged with the existing data.
     */
    save: interfaces.DataStoreMethod;
    /**
     * Deletes the specified resource(s) from the data store.
     */
    delete: interfaces.DataStoreMethod;
    /**
     * Returns all resources in the specified collection
     * @param collection The collection path (such as "/pets", "/users/jdoe/orders", etc.)
     * @param callback An error-first callback. The second parameter is an array of all Resource objects in the collection.
     * If there are no resources in the collection, then the array is empty.
     */
    getCollection(collection: string, callback?: interfaces.ResourceCallback): void;
    /**
     * Deletes all resources in the specified collection
     * @param collection The collection path (such as "/pets", "/users/jdoe/orders", etc.)
     * @param callback An error-first callback. The second parameter is an array of all Resource objects that were deleted.
     * If nothing was deleted, then the array is empty.
     */
    deleteCollection(collection: string, callback?: interfaces.ResourceCallback): void;
  }

  /**
   * This is the default data store that's used by the Mock middleware.
   * It simply stores data in an array in memory, which means the data only lasts as long as your app is running.
   * When your app restarts, none of the data from the previous run will be there anymore.
   * This may be exactly what you want if you're using the Mock middleware for a quick demo or to test-out your API as you create it.
   * But if you need your data to stick around even after your app shuts down, then you might want to check out the FileDataStore class instead.
   */
  export class MemoryDataStore extends DataStore {
    constructor();
  }

  /**
   * This data store persists its data to JSON files, which means the data doesn't go away when your app restarts, like it does with the MemoryDataStore.
   * This allows you to easily create an API that acts like it has a real database behind it, so you can use the Mock middleware to create some data,
   * and then use that data for a demos and presentations days or weeks later.
   */
  export class FileDataStore extends DataStore {
    /**
     * @param baseDir The directory where the JSON files will be saved.
     * The FileDataStore will create separate folders and files under this directory for each path in your Swagger API.
     *  If you don't specify this parameter, then it defaults to process.cwd().
     */
    constructor(baseDir?: string);
  }
}

export = middleware;
