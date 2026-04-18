import { Inject, Service } from "typedi";
import { Application } from "express-serve-static-core";
import { AppMiddleware } from "./AppMiddleware";
import { AppHeaders } from "./AppHeaders";
import { RootController, CheckoutController, TicketController, DBConnection, HOST, PORT, TombolaController } from "@org/api/products";

@Service()
export class App {
    @Inject(HOST)
    private host: string;

    @Inject(PORT)
    private port: number;

    @Inject('app')
    private app: Application;

    @Inject(() => AppMiddleware)
    private middlewares: AppMiddleware;

    @Inject(() => AppHeaders)
    private appHeaders: AppHeaders;

    @Inject(() => RootController)
    private rootController: RootController;

    @Inject(() => CheckoutController)
    private checkoutController: CheckoutController;

    @Inject(() => TicketController)
    private ticketController: TicketController;

    @Inject(() => TombolaController)
    private tombolaController: TombolaController;

    @Inject(() => DBConnection)
    private dBConnection: DBConnection;

    public async startApp(): Promise<void> {
        // connect and init database
        await this.dBConnection.connect();
        await this.dBConnection.prepareOpenTombolaDB();

        // Middleware
        this.middlewares.registerMiddleware();

        // CORS configuration for Angular app
        this.appHeaders.registerHeaders();

        // // Register api routes
        this.rootController.registerRoutes();
        this.checkoutController.registerRoutes();
        this.ticketController.registerRoutes();
        this.tombolaController.registerRoutes();

        this.app.listen(this.port, this.host, () => {
            console.log(`[ ready ] http://${this.host}:${this.port}`);
        });
    }
}