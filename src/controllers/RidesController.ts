import { Request, Response } from 'restify';
import { SDKFactory, Config, Need } from 'dav-js';
import SDK from 'dav-js/dist/SDK';
const sdkConfiguration = {
  apiSeedUrls: ['http://localhost:8084'],
  kafkaSeedUrls: ['localhost:9092'],
};

export default class RidesController {

  public sdk: SDK;

  constructor() {
    const config = new Config(sdkConfiguration);
    this.sdk = SDKFactory(config);
  }

  private async setDriverStatus(driverId: string, active: boolean) {
    // TODO: send message to needs handler.
  }

  private async setBidStatus(bidId: string, active: boolean) {
    // TODO: send message to bids handler.
  }

  public async registerForNeeds(request: Request, response: Response) {
    response.send(200, {
      active: true,
    }, { contentType: 'application/json' });
    // const { driverId } = request.user.id;
    // try {
    //     this.setDriverStatus(driverId, true);
    //     response.send(200, {
    //         active: true,
    //       }, { contentType: 'application/json' });
    // } catch (err) {
    //     response.send(500, err);
    // }
  }

  public async unregisterForNeeds(request: Request, response: Response) {
    response.send(200, {
      active: false,
    }, { contentType: 'application/json' });
    // const { driverId } = request.user.id;
    // try {
    //     this.setDriverStatus(driverId, false);
    //     response.send(200, {
    //         active: false,
    //       }, { contentType: 'application/json' });
    // } catch (err) {
    //     response.send(500, err);
    // }
  }

  public async commitRide(request: Request, response: Response) {
    const a = Math.random() * 3;
    if (a < 1) {
      response.send(417, { msg: 'Ride has been already taken' }, { contentType: 'application/json' });
    } else {
      response.send(200, {}, { contentType: 'application/json' });
    }
    // try {
    //     const { driverId } = request.user.id;
    //     const driver = await findById(driverId);
    //     const identity = await this.sdk.getIdentity(driver.davId);
    //     const bidId = request.query.rideId;
    //     const { commitmentRequest } = findBidById(bidId);
    //     commitmentRequest.confirm();
    //     this.setBidStatus(bidId, false);
    //     response.send(200, {}, { contentType: 'application/json' });
    // } catch (err) {
    //     response.send(500, err);
    // }
  }

  public async declineRide(request: Request, response: Response) {
    // const bidId = request.query.rideId;
    // this.setBidStatus(bidId, false);
    response.send(200, {}, { contentType: 'application/json' });
  }

  public async rides(request: Request, response: Response) {
    const rideMock = {
      id: 'ride-id',
      status: 'available',
      pickup: {
        lat: '43.65',
        long: '-79.38',
      },
      destination: {
        lat: '43.66',
        long: '-79.37',
      },
      note: 'Please pick me up',
      price: 1.2,
      passenger: {
        name: 'Jhonny Jhonson',
        imageUrl: 'https://avatars3.githubusercontent.com/u/11968040?s=88&v=4',
        ridesNumber: 48,
        rating: 4.4,
      },
      confirmationDeadline: Date.now() + 10000,
    };
    response.send(200, rideMock, { contentType: 'application/json' });
  }

  public async driverHasArrived(request: Request, response: Response) {
    // const rideId = request.query.rideId;
    // const { driverId } = request.user.id;
    response.send(200, {}, { contentType: 'application/json' });
  }

  public async startRide(request: Request, response: Response) {
    // const rideId = request.query.rideId;
    // const { driverId } = request.user.id;
    response.send(200, {}, { contentType: 'application/json' });
  }

  public async endRide(request: Request, response: Response) {
    // const rideId = request.query.rideId;
    // const { driverId } = request.user.id;
    response.send(200, {}, { contentType: 'application/json' });
  }

}
