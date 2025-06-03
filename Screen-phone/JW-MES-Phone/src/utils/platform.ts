import Taro from '@tarojs/taro';

export const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP;
export const isH5 = Taro.getEnv() === Taro.ENV_TYPE.WEB;
export const isAlipay = Taro.getEnv() === Taro.ENV_TYPE.ALIPAY;

export default {
  isWeapp,
  isH5,
  isAlipay
};
