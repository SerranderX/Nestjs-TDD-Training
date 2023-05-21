import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from '@appointment/appointment.service';
import { Appointment } from '@appointment/models/appointment.model';

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentService],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should schedule an unconfirmed appointment for a user on success', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-01T15:00:00Z');

    const newAppointment: Appointment = service.scheduleAppointment({
      patientId: 1,
      startTime,
      endTime,
    });

    expect(newAppointment).toEqual({
      patientId: 1,
      startTime,
      endTime,
      confirmed: false,
    });
  });

  it('should throw an error when end time is before start time', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-01T13:00:00Z');

    /**
     * We have to wrap our "scheduleAppointment" function in another arrow function
     * because we expect an error to be thrown. If we don't do that,
     * Jest won't be able to properly handle the error and it will accuse that the test failed.
     */
    expect(() =>
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      }),
    ).toThrowError("Appointment's endTime should be after startTime");
  });

  it('should throw an error when end time is equal or less than thirdty minutes to start time', () => {
    let startTime = new Date('2022-01-01T14:00:00Z');
    let endTime = startTime;

    expect(() =>
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      }),
    ).toThrowError(
      "Appointment's endTime should be after startTime and a minimun of thirdty minutes must elapse",
    );

    startTime = new Date('2022-01-01T14:00:00Z');
    endTime = new Date('2022-01-01T14:29:00Z');

    expect(() =>
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      }),
    ).toThrowError(
      "Appointment's endTime should be after startTime and a minimun of thirdty minutes must elapse",
    );
  });

  it('should throw an error when end time is in the next day', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-02T00:00:00Z');

    expect(() =>
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      }),
    ).toThrowError(
      "Appointment's endTime should be in the same day as start time's",
    );
  });

  it('should throw an error when end time is in same day and hour of next month', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-02-01T14:00:00Z');

    expect(() =>
      service.scheduleAppointment({
        patientId: 1,
        startTime,
        endTime,
      }),
    ).toThrowError(
      "Appointment's endTime should be in the same day as start time's",
    );
  });
});
