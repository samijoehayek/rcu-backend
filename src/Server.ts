import { join } from "path";
import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import "@tsed/swagger";
import cors from "cors";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import { config } from "./config/index";
import * as pages from "./controllers/pages/index";
import * as v1 from "./controllers/v1/index";
import session from "express-session";
import { InjectorService } from "./services/injector.service";
import { specInfo } from "./specs/specInfo";

const rootDir = __dirname;
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];

@Configuration({
  rootDir,
  allowedOrigins,
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  componentsScan: [`${rootDir}/repositories/*.ts`, `${rootDir}/app-services/*.ts`, `${rootDir}/services/*.ts`, `${rootDir}/protocols/*.ts`],
  multer: {
    dest: `${rootDir}../../public`
  },
  statics: {
    "/": [
      {
        root: `./public`,
        hook: "$beforeRoutesInit"
      }
    ]
  },
  disableComponentsScan: true,
  ajv: {
    returnsCoercedValues: true
  },
  mount: {
    "/v1": [...Object.values(v1)],
    "/": [...Object.values(pages)]
  },
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1",
      spec: {
        info: specInfo
      }
    }
  ],
  middlewares: [
    cors({
      origin: [...allowedOrigins],
      credentials: true, // ADDED: Important if you're using cookies/auth
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // ADDED: OPTIONS and PATCH
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"], // ADDED: More headers
      exposedHeaders: ["Content-Range", "X-Content-Range"], // ADDED: Expose headers if needed
      maxAge: 86400, // ADDED: Cache preflight for 24 hours (reduces requests on slow networks)
      preflightContinue: false, // ADDED: Don't pass to next handler
      optionsSuccessStatus: 204 // ADDED: Some legacy browsers choke on 200
    }),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    })
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: ["**/*.spec.ts"]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;

  @Inject(InjectorService)
  protected injectorService: InjectorService;

  $beforeRoutesInit() {
    // ADDED: Explicit OPTIONS handler for all routes (fallback)
    this.app.use((req: { method: string; headers: { origin: any; }; path: any; }, res: any, next: () => void) => {
      if (req.method === 'OPTIONS') {
        console.log('OPTIONS request:', {
          origin: req.headers.origin,
          path: req.path,
          timestamp: new Date().toISOString()
        });
      }
      next();
    });

    this.app
      .use(cookieParser())
      .use(methodOverride())
      .use(bodyParser.json({ limit: "2gb" }))
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(
        session({
          secret: "RCUBackendKey",
          resave: true,
          saveUninitialized: true,
          cookie: {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // CHANGED: Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000 // CHANGED: 24 hours instead of 1ms
          }
        })
      );
  }
}