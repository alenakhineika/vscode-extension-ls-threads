import { parentPort, workerData } from 'worker_threads';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const executeSleep = async (test: any) => {
  console.log('Test value:', test);

  try {
    return [null, await sleep(10000)];
  } catch (error) {
    return [error];
  }
}

// parentPort allows communication with the parent thread
(async () => {
  parentPort?.postMessage(
    await executeSleep(workerData.test)
  );
})();
