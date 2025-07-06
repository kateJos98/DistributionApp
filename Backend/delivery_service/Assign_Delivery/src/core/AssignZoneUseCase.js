export class AssignZoneUseCase {
  constructor(zoneRepository, notifierService) {
    this.zoneRepository = zoneRepository;
    this.notifierService = notifierService;
  }

  async execute(driverId, zoneId) {
    await this.zoneRepository.assign(driverId, zoneId);
    await this.notifierService.notifyZoneAssigned(driverId, zoneId);
    return { driverId, zoneId };
  }
}
