class Artist {
    constructor({ id, name, images, start_time, end_time, stage_name, stage_day, rank }) {
      this.id = id;
      this.name = name;
      this.images = images;
      this.startTime = start_time;
      this.endTime = end_time;
      this.stageName = stage_name;
      this.stageDay = stage_day;
      this.rank = rank;
    }
  }
  
  export default Artist;