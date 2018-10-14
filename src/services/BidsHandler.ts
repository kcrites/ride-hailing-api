import { SDKFactory, Config, Need, Bid } from 'dav-js';
import BidParams from 'dav-js/dist/ride-hailing/BidParams';
import SDK from 'dav-js/dist/SDK';
import { IDriver } from '../cassandra/drivers';
import CommitmentRequest from 'dav-js/dist/CommitmentRequest';
const sdkConfiguration = {
    apiSeedUrls: ['http://localhost:8084'],
    kafkaSeedUrls: ['localhost:9092'],
};

class BidsHandler {

    private sdk: SDK;
    private availableDrivers: any;

    constructor() {
        const config = new Config(sdkConfiguration);
        this.sdk = SDKFactory(config);
    }

    private async restoreBid(driver: any): Promise<Bid<BidParams>> {
        const identity = await this.sdk.getIdentity(driver.davId);
        const bidData = driver.bid; // TODO
        const bid = await identity.bid(bidData.bidId, bidData.bidParams);
        return bid;
    }

    private announceToDriver(driver: IDriver, commitmentRequest: CommitmentRequest) {
        console.log('ToDo');
    }

    private async handleBids(driverId: string) {
        const driver = await this.getDriverData(driverId);
        if (!driver) {
            this.availableDrivers[driverId] = null;
            return;
        }
        const bid = await this.restoreBid(driver);
        const commitmentRequests = await bid.commitmentRequests();
        this.availableDrivers[driverId] = commitmentRequests;
        commitmentRequests.subscribe((commitmentRequest: any) => {
            this.announceToDriver(driver, commitmentRequest);
        });
    }

    private async getDriverData(driverId: string): Promise<IDriver> {
        return null;
    }

    public add(driverId: string) {
        this.handleBids(driverId);
    }

    public remove(driverId: string) {
        const commitmentRequests = this.availableDrivers[driverId];
        commitmentRequests.unsubscribe();
        this.availableDrivers[driverId] = null;
    }
}
