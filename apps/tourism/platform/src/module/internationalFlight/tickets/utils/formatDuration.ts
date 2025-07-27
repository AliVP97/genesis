export type DurationData = {
  hours?: string;
  minutes?: string;
};

/**
 * Computes the formatted duration text in hours and minutes.
 */
function formatDuration<
  AsData extends boolean = false,
  Output = AsData extends true ? DurationData : string,
>(duration: number | undefined, asData: AsData = false as AsData): Output {
  if (!duration || isNaN(duration)) {
    return (asData ? {} : '') as Output;
  }

  const result: DurationData = {};
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  if (hours > 0) {
    result.hours = `${hours} ساعت`;
  }

  if (minutes > 0) {
    result.minutes = `${minutes} دقیقه`;
  }

  if (asData) {
    return result as Output;
  }

  const displayParts: string[] = [];

  if (result.hours) {
    displayParts.push(result.hours);
  }

  if (result.minutes) {
    displayParts.push(result.minutes);
  }

  return displayParts.join(' و ') as Output;
}

export default formatDuration;
