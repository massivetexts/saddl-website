// copies from https://www.tutorialspoint.com/levenshtein-distance-in-javascript

function argMin(array) {
  return [].reduce.call(array, (m, c, i, arr) => c < arr[m] ? i : m, parseFloat("inf"))
}

export function median_string(list_of_strings) {
  // True Levenshtein distance median is NP-hard. This is the median 
  // within the passed set.

  const distances = list_of_strings.map(() => 0)

  for (let i = 0; i < list_of_strings.length - 1; i++) {
    for (let j = i + 1; j < list_of_strings.length; j++) {
      const d = levenshteinDistance(list_of_strings[i], list_of_strings[j])
      distances[i] += d
      distances[j] += d
    }
  }
  return list_of_strings(argMin(distances))
}

export function levenshteinDistance(str1, str2) {
  const track = Array(str2.length + 1).fill(null).map(() =>
  Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
     track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
     track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
     for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
           track[j][i - 1] + 1, // deletion
           track[j - 1][i] + 1, // insertion
           track[j - 1][i - 1] + indicator, // substitution
        );
     }
  }
  return track[str2.length][str1.length];
}