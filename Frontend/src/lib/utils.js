//function that converts a number of followers into a formatted string with k for thousands and M for millions
export function formatFollowers(followers) {
  if (followers >= 1000000) {
    // Format in millions (M) with one decimal point
    return (followers / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (followers >= 1000) {
    // Format in thousands (K) with one decimal point
    return (followers / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    // Return the number as is for values less than 1000
    return followers.toString();
  }
}

// function to convert a MongoDB date into a 17Dec format
export function formatMongoDate(dateString) {
  const date = new Date(dateString); // Parse the MongoDB date string
  const today = new Date();

  // Calculate the difference in time (milliseconds) and convert to days
  const differenceInTime = today - date;
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  // If within the last week, return relative time
  if (differenceInDays >= 0 && differenceInDays < 7) {
    return `${differenceInDays === 0 ? "Today" : `${differenceInDays}d ago`}`;
  }

  // Otherwise, return formatted date as "17 Dec 2024"
  const options = { day: "numeric", month: "short", year: "numeric" }; // Format: 17 Dec 2024
  return date.toLocaleDateString("en-US", options).replace(",", ""); // Ensure there are no unnecessary commas
}

// Delete given element from array
export function deleteArrayElement(array, element) {
  let arrayClone = [...array];
  let index = arrayClone.findIndex((item) => item === element);
  if (index !== -1) arrayClone.splice(index, 1);
  return arrayClone;
}

// Triggered given function only after a specified delay
export function debounce(func, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
