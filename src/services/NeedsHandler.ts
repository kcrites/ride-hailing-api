import { SDKFactory, Config, Need } from 'dav-js';
import SDK from 'dav-js/dist/SDK';
import { IDriver } from '../cassandra/drivers';
import NeedFilterParams from 'dav-js/dist/ride-hailing/NeedFilterParams';
import NeedParams from 'dav-js/dist/ride-hailing/NeedParams';
import BidParams from 'dav-js/dist/ride-hailing/BidParams';
const sdkConfiguration = {
    apiSeedUrls: ['http://localhost:8084'],
    kafkaSeedUrls: ['localhost:9092'],
};

const getCityDimension = (city: string) => ({
    location: {
        lat: 32.050382,
        long: 34.766149,
    },
    radius: 5000,
});

const getBidParams = (driver: any, need: Need<NeedParams>) => {
    return new BidParams({

    });
};

class NeedHandler {

    private sdk: SDK;
    private availableDrivers: any;

    constructor() {
        const config = new Config(sdkConfiguration);
        this.sdk = SDKFactory(config);
    }

    private async createNeedsStream(driver: any) {
        const identity = await this.sdk.getIdentity(driver.davId);
        const { location, radius } = getCityDimension(driver.city);
        const filterParams = new NeedFilterParams({
            location,
            radius,
        });
        const needs = identity.needsForType(filterParams);
        return needs;
    }

    private async handleNeeds(driverId: string) {
        const driver = this.getDriverData(driverId);
        if (!driver) {
            this.availableDrivers[driverId] = null;
            return;
        }
        const needs = await this.createNeedsStream(driver);
        this.availableDrivers[driverId] = needs;
        needs.subscribe((need: Need<NeedParams>) => {
            const bidParams = getBidParams(driver, need);
            need.createBid(bidParams);
        });
    }

    private async getDriverData(driverId: string) {
        return {};
    }

    public add(driverId: string) {
        this.handleNeeds(driverId);
    }

    public remove(driverId: string) {
        const needs = this.availableDrivers[driverId];
        needs.unsubscribe();
        this.availableDrivers[driverId] = null;
    }
}
