import { parentPort, workerData } from 'worker_threads';

type WorkerResult = any;
type WorkerError = string | null;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// The long-running operation
const executeSleep = async (test: any): Promise<[WorkerError, WorkerResult?]> => {
  // The `test` variable from the main thread is accessible here

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
