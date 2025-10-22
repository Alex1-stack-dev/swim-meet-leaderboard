interface HyTekMeetConfig {
  meetName: string;
  meetDate: string;
  poolLength: '25M' | '50M' | '25Y';
  courseType: 'SCM' | 'LCM' | 'SCY';
  sanctionNumber?: string;
}

export class HyTekExporter {
  private meetConfig: HyTekMeetConfig;

  constructor(config: HyTekMeetConfig) {
    this.meetConfig = config;
  }

  private formatTime(time: string): string {
    // Convert mm:ss.ms to HY-TEK format (MMSSHH)
    const [minutes, rest] = time.split(':');
    const [seconds, hundredths] = rest.split('.');
    return `${minutes.padStart(2, '0')}${seconds.padStart(2, '0')}${hundredths.padStart(2, '0')}`;
  }

  private generateHeader(): string {
    const date = new Date(this.meetConfig.meetDate);
    const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    
    return [
      'A1;1;', // File format version
      `B1;${this.meetConfig.meetName};${formattedDate};${this.meetConfig.poolLength};`,
      `C1;${this.meetConfig.sanctionNumber || 'NONE'};`,
    ].join('\r\n');
  }

  private formatEvent(event: any): string {
    // D0 record format: Individual event
    // D1 record format: Relay event
    const isRelay = event.isRelay;
    const prefix = isRelay ? 'D1' : 'D0';
    
    return `${prefix};${event.eventNumber.toString().padStart(4, '0')};` +
           `${event.heatNumber.toString().padStart(2, '0')};` +
           `${event.lane.toString().padStart(2, '0')};` +
           `${this.formatTime(event.time)};` +
           `${event.athleteName.padEnd(28, ' ')};` +
           `${event.team.padEnd(4, ' ')};`;
  }

  private generateSplits(splits: string[]): string[] {
    // E0 record format: Split times
    return splits.map((split, index) => 
      `E0;${(index + 1).toString().padStart(2, '0')};${this.formatTime(split)};`
    );
  }

  public generateHy3File(results: any[]): Uint8Array {
    const lines: string[] = [
      this.generateHeader(),
      ...results.flatMap(result => [
        this.formatEvent(result),
        ...this.generateSplits(result.splits || [])
      ]),
      'Z0;' // End of file marker
    ];

    // Convert to UTF-8 encoded byte array
    const encoder = new TextEncoder();
    return encoder.encode(lines.join('\r\n'));
  }
}
