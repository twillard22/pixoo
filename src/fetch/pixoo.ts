import { debounce } from '../utils/debounce';

const host = 'http://192.168.1.126:5001';

const putPixoo = (endpoint: 'brightness', data: number) => {
  debounce(() => {
    fetch(`${host}/${endpoint}/` + data, {
      method: 'PUT',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
      },
    });
  }, 500);
};

const postPixoo = (endpoint: 'pixel' | 'fill', data: object) => {
  let formBody = [];
  for (const property in data) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }

  fetch(`${host}/${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    },
    body: formBody.join('&'),
  });
};

const postFormPixoo = (endpoint: 'image', formData: FormData) => {
  fetch(`${host}/${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data;',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    },
    body: formData,
  });
};

const pixelPixoo = (data: object) => {
  postPixoo('pixel', data);
};

type FillPixooProps = {
  r: number;
  g: number;
  b: number;
};

export const updateFill = (data: FillPixooProps) => {
  const details = { ...data, push_immediately: true };

  postPixoo('fill', details);
};

type UpdatePixooProps = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
};

export const updatePixooPixels = (data: UpdatePixooProps[]) => {
  data.forEach((drawing, index) => {
    pixelPixoo({
      x: drawing.x,
      y: drawing.y,
      r: drawing.r,
      g: drawing.g,
      b: drawing.b,
      push_immediately: index === data.length - 1,
    });
  });
};

export const clearPixoo = () => {
  updateFill({ r: 0, g: 0, b: 0 });
};

export const updateBrightness = (brightness: number) => {
  putPixoo('brightness', brightness);
};

export const updateVisualizer = () => {};

export const updateImage = (uri: string, name: string) => {
  const data = new FormData();

  // @ts-ignore //don't know why this causes a ts error for blobs but it works!
  data.append('image', { uri: uri, name: name, type: 'image/jpeg' });
  data.append('x', '0');
  data.append('y', '0');
  data.append('push_immediately', 'true');

  postFormPixoo('image', data);
};
