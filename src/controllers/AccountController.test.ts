import { Request, Response } from 'restify';
import { IDriver, IPersonalDetails, ICompanyDetails, IVehicleDetails } from '../cassandra/drivers';
import { v4 as uuid} from 'uuid';
import { IRequestWithAuthentication } from '../lib/auth';

describe('AccountController class', () => {
  describe('authenticateDriver method', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
      jest.clearAllMocks();
    });

    it('should send valid token when created new account', async () => {
      const email = 'test@dav.network';
      const password = 'funindav1234';
      const ip = '10.0.0.1';
      const city = 'Vatican';
      const hashedPassword = '$2b$10$K6BIhI1E6tBtsiWvBlh/zuN.C.2yT5Cu/GCOJHs9419Bm1PefvPyu';

      const driver = {
        phoneNumber: '+1236479879',
        profilePhotoId: 'Img1',
        licensePhotoId: 'Img2',
        firstName: 'His Holiness Pope Francis',
        lastName: 'Francis',
        email,
        password,
        companyName: 'Holy church of our lord and saviour Jesus Christ',
        vatNumber: '12453456',
        address: 'Apostolic Palace',
        city,
        make: 'Ford',
        model: 'Popemobile',
        year: '2007',
        licensePlate: 'SCV 00919',
        vehicleColor: 'white',
      };

      const saveDriver: IDriver  = {
        city,
        companyAddress: 'Apostolic Palace',
        companyCity: city,
        companyName: 'Holy church of our lord and saviour Jesus Christ',
        createdFrom: ip,
        davId: null,
        email: 'test@dav.network',
        emailConfirmed: false,
        firstName: 'His Holiness Pope Francis',
        id: expect.anything(),
        lastName: 'Francis',
        licenseImageUrl: 'Img2',
        password: '$2b$10$K6BIhI1E6tBtsiWvBlh/zuN.C.2yT5Cu/GCOJHs9419Bm1PefvPyu',
        phoneConfirmed: true,
        phoneNumber: '+1236479879',
        privateKey: null,
        profileImageUrl: 'Img1',
        vatNumber: '12453456',
        vehicleColor: 'white',
        vehicleImageUrl: null,
        vehicleMake: 'Ford',
        vehicleModel: 'Popemobile',
        vehiclePlateNumber: 'SCV 00919',
        vehicleYear: 2007,
      };

      const authMock = {
        generateSignedToken: jest.fn((driverParam: IDriver) => token),
      };
      jest.doMock('../lib/auth', () => authMock);
      const cassandraMock = {
        insert: jest.fn(d => driver),
      };
      jest.doMock('../cassandra/drivers', () => cassandraMock);

      jest.doMock('bcrypt', () => ({
        hash: jest.fn((data, salt, cb) => cb(null, hashedPassword)),
      }));

      const accountController = (await import('./AccountController')).default;
      const token = 'token';
      const requestMock = jest.fn<Request>(() => ({
        body: driver,
        connection: {
          remoteAddress: ip,
        },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.insertDriver(requestMockInstance, responseMockInstance);

      expect(cassandraMock.insert).toHaveBeenCalledWith(saveDriver);
      expect(cassandraMock.insert).toHaveBeenCalledTimes(1);
      expect(authMock.generateSignedToken).toHaveBeenCalledTimes(1);
      expect(authMock.generateSignedToken).toHaveBeenCalledWith(saveDriver);
      expect(responseMockInstance.send).toBeCalledWith(200, {
        message: 'Registered driver details',
        token,
      });
    });

    it('should send valid token when get valid params', async () => {
      const email = 'test@dav.network';
      const password = 'funindav1234';
      const hashedPassword = '$2b$10$K6BIhI1E6tBtsiWvBlh/zuN.C.2yT5Cu/GCOJHs9419Bm1PefvPyu';
      const cassandra = require('../cassandra/drivers');
      cassandra.findByEmail = jest.fn((emailParam: string) => driver);
      const authMock = {
        generateSignedToken: jest.fn((driverParam: IDriver) => token),
      };
      jest.doMock('../lib/auth', () => authMock);
      jest.doMock('bcrypt', () => ({
        // hash: jest.fn((data, salt, cb) => Promise.resolve(hashedPassword)),
        compare: jest.fn((receivedPass, savedPass) => Promise.resolve(true)),
      }));
      const accountController = (await import('./AccountController')).default;
      const token = 'token';
      const driver: IDriver = {id: 'id', password: hashedPassword};
      const requestMock = jest.fn<Request>(() => ({
        body: { email, password },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.authenticateDriver(requestMockInstance, responseMockInstance);

      expect(cassandra.findByEmail).toHaveBeenCalledWith(email);
      expect(authMock.generateSignedToken).toHaveBeenCalledWith(driver);
      expect(responseMockInstance.send).toBeCalledWith(200, {token});
    });

    it('should send userAuthenticated false when get invalid password', async () => {
      const email = 'test@dav.network';
      const password = 'notfunindav1234';
      const hashedPassword = '$2b$10$K6BIhI1E6tBtsiWvBlh/zuN.C.2yT5Cu/GCOJHs9419Bm1PefvPyu';
      const cassandra = require('../cassandra/drivers');
      cassandra.findByEmail = jest.fn((emailParam: string) => driver);
      const authMock = {
        generateSignedToken: jest.fn((driverParam: IDriver) => token),
      };
      jest.doMock('../lib/auth', () => authMock);
      jest.doMock('bcrypt', () => ({
        // hash: jest.fn((data, salt, cb) => Promise.resolve(hashedPassword)),
        compare: jest.fn((receivedPass, savedPass) => Promise.resolve(false)),
      }));
      const accountController = (await import('./AccountController')).default;
      const token = 'token';
      const driver: IDriver = {id: 'id', password: hashedPassword};
      const requestMock = jest.fn<Request>(() => ({
        body: { email, password },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.authenticateDriver(requestMockInstance, responseMockInstance);

      expect(cassandra.findByEmail).toHaveBeenCalledWith(email);
      expect(authMock.generateSignedToken).toHaveBeenCalledTimes(0);
      expect(responseMockInstance.send).toBeCalledWith(200, {userAuthenticated: false});
    });

    it('should send userAuthenticated false when get invalid email', async () => {
      const email = 'invalid@dav.network';
      const password = 'funindav1234';
      const hashedPassword = '$2b$10$K6BIhI1E6tBtsiWvBlh/zuN.C.2yT5Cu/GCOJHs9419Bm1PefvPyu';
      const cassandra = require('../cassandra/drivers');
      cassandra.findByEmail = jest.fn((emailParam: string) => null);
      const authMock = {
        generateSignedToken: jest.fn((driverParam: IDriver) => token),
      };
      jest.doMock('../lib/auth', () => authMock);
      const accountController = (await import('./AccountController')).default;
      const token = 'token';
      const driver: IDriver = {id: 'id', password: hashedPassword};
      const requestMock = jest.fn<Request>(() => ({
        body: { email, password },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.authenticateDriver(requestMockInstance, responseMockInstance);

      expect(cassandra.findByEmail).toHaveBeenCalledWith(email);
      expect(authMock.generateSignedToken).toHaveBeenCalledTimes(0);
      expect(responseMockInstance.send).toBeCalledWith(200, {userAuthenticated: false});
    });
  });

  describe('Driver Details methods', () => {
    const user = {
      id: uuid(),
    };

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should return account for logged in user', async () => {
      const cassandra = require('../cassandra/drivers');
      cassandra.findById = jest.fn((id: string) => driver);
      const accountController = (await import('./AccountController')).default;
      const driver: IDriver = {id: 'id', firstName: 'asdasd'};
      const requestMock = jest.fn<IRequestWithAuthentication>(() => ({
        body: { },
        user,
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.getCurrentlyLoggedIn(requestMockInstance, responseMockInstance);

      expect(cassandra.findById).toHaveBeenCalledWith(user.id);
      expect(responseMockInstance.send).toBeCalledWith(200, { account: driver });
    });

    it('should return unauthorized for not logged in user', async () => {
      const cassandra = require('../cassandra/drivers');
      cassandra.findById = jest.fn((id: string) => new Object());
      const accountController = (await import('./AccountController')).default;
      const requestMock = jest.fn<IRequestWithAuthentication>(() => ({
        body: { },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.getCurrentlyLoggedIn(requestMockInstance, responseMockInstance);
      expect(cassandra.findById).toHaveBeenCalledTimes(0);
      expect(responseMockInstance.send).toBeCalledWith(401, 'User id is not set');
    });

    it('should update driver details ', async () => {
      const cassandra = require('../cassandra/drivers');
      cassandra.updatePersonalDetails = jest.fn((pd: IPersonalDetails) => personalDetails);
      const accountController = (await import('./AccountController')).default;
      const personalDetails: IPersonalDetails = {
        id: user.id,
        firstName: 'asdasd',
        lastName: 'dcvdcv',
        email: 'a@b.c',
        city: 'NYC',
        profileImageUrl: 'img1',
        licenseImageUrl: 'img2',
      };
      const requestMock = jest.fn<IRequestWithAuthentication>(() => ({
        body: { ...personalDetails },
        user,
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.updatePersonalDetails(requestMockInstance, responseMockInstance);

      expect(cassandra.updatePersonalDetails).toHaveBeenCalledWith(personalDetails);
      expect(responseMockInstance.send).toBeCalledWith(200, {message: 'Updated driver details'});
    });

    it('should update company details ', async () => {
      const companyDetails: ICompanyDetails = {
        id: user.id,
        companyName: 'Holy church of our lord and saviour Jesus Christ',
        vatNumber: '5675648',
        companyAddress: 'Apostolic Palace',
        companyCity: 'Vatican',
      };
      const cassandra = require('../cassandra/drivers');
      cassandra.updateCompanyDetails = jest.fn((cd: ICompanyDetails) => companyDetails);
      const accountController = (await import('./AccountController')).default;
      const requestMock = jest.fn<IRequestWithAuthentication>(() => ({
        body: { ...companyDetails },
        user,
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.updateCompanyDetails(requestMockInstance, responseMockInstance);

      expect(cassandra.updateCompanyDetails).toHaveBeenCalledWith(companyDetails);
      expect(responseMockInstance.send).toBeCalledWith(200, {message: 'Updated company details'});
    });

    it('should update vehicle details ', async () => {
      const vehicleDetails: IVehicleDetails = {
        id: user.id,
        vehicleMake: 'Ford',
        vehicleModel: 'Popemobile',
        vehicleYear: 2007,
        vehiclePlateNumber: 'SCV 00919',
        vehicleColor: 'white',
        vehicleImageUrl: 'SomeVehImage',
      };
      const cassandra = require('../cassandra/drivers');
      cassandra.updateVehicleDetails = jest.fn((cd: IVehicleDetails) => vehicleDetails);
      const accountController = (await import('./AccountController')).default;
      const requestMock = jest.fn<IRequestWithAuthentication>(() => ({
        body: { ...vehicleDetails },
        user,
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.updateVehicleDetails(requestMockInstance, responseMockInstance);

      expect(cassandra.updateVehicleDetails).toHaveBeenCalledWith(vehicleDetails);
      expect(responseMockInstance.send).toBeCalledWith(200, {message: 'Updated vehicle details'});
    });
  });

  describe('sendPasswordResetEmail', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should send password reset email successfully when params are valid', async () => {
      const cassandra = require('../cassandra/drivers');
      cassandra.findByEmail = jest.fn((emailParam: string) => driver);
      const authMock = {
        generateSignedToken: jest.fn((driverParam: IDriver) => token),
      };
      let htmlSent = '';
      const sendEmailMock = jest.fn((from: string, to: string, subject: string, html: string) => {
        htmlSent = html;
        return Promise.resolve('success');
      });
      jest.doMock('../lib/auth', () => authMock);
      jest.doMock('../lib/email', () => ({default: sendEmailMock}));
      const accountController = (await import('./AccountController')).default;
      const token = 'tokenabc';
      const email = 'test@dav.network';
      const driver: IDriver = {id: 'id', email};
      const requestMock = jest.fn<Request>(() => ({
        query: { email },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.sendPasswordResetEmail(requestMockInstance, responseMockInstance);

      expect(cassandra.findByEmail).toHaveBeenCalledWith(email);
      expect(authMock.generateSignedToken).toHaveBeenCalledWith(driver);
      expect(sendEmailMock).toHaveBeenCalledWith(expect.anything(), email, expect.anything(), expect.anything());
      expect(htmlSent.indexOf(token) > -1);
    });

    it('should not send password reset email when it does not exist in database' , async () => {
      const cassandra = require('../cassandra/drivers');
      cassandra.findByEmail = jest.fn((emailParam: string) => null);
      const authMock = {
        generateSignedToken: jest.fn((driverParam: IDriver) => token),
      };
      const sendEmailMock = jest.fn((from: string, to: string, subject: string, html: string) => Promise.resolve('should not happen'));
      jest.doMock('../lib/auth', () => authMock);
      jest.doMock('../lib/email', () => ({default: sendEmailMock}));
      const accountController = (await import('./AccountController')).default;
      const token = 'token';
      const email = 'test@dav.network';
      const driver: IDriver = {id: 'id', email};
      const requestMock = jest.fn<Request>(() => ({
        query: { email },
      }));
      const requestMockInstance = new requestMock();
      const responseMock = jest.fn<Response>(() => ({
        send: jest.fn(() => ''),
      }));
      const responseMockInstance = new responseMock();
      const accountControllerInstance = new accountController();

      await accountControllerInstance.sendPasswordResetEmail(requestMockInstance, responseMockInstance);

      expect(cassandra.findByEmail).toHaveBeenCalledWith(email);
      expect(authMock.generateSignedToken).toHaveBeenCalledTimes(0);
      expect(sendEmailMock).toHaveBeenCalledTimes(0);
    });
  });
});
