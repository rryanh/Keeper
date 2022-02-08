const TIMEOUT_SECONDS = 10;

export const AJAX = async function (url, options = {}) {
  try {
    const res = await Promise.race([
      fetch(url, options),
      timeout(TIMEOUT_SECONDS),
    ]);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.message} (${data.status})`);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
