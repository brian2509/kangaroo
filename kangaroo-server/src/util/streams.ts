// https://stackoverflow.com/questions/14269233/node-js-how-to-read-a-stream-into-a-buffer
export const streamToBuffer = async (stream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const data = [];

    stream.on("data", (chunk) => {
      data.push(chunk);
    });

    stream.on("end", () => {
      resolve(Buffer.concat(data));
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};
