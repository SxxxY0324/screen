import { useDispatch, useSelector } from 'react-redux';

/**
 * 类型安全的useDispatch钩子
 * 
 * 这个钩子是标准useDispatch的简单封装，提供了更好的类型推断
 * 在整个应用中使用这个钩子而不是直接使用useDispatch
 * 
 * @returns {Function} Redux dispatch函数
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(someAction());
 */
export const useAppDispatch = useDispatch;

/**
 * 类型安全的useSelector钩子
 * 
 * 这个钩子是标准useSelector的简单封装，提供了更好的类型推断
 * 在整个应用中使用这个钩子而不是直接使用useSelector
 * 
 * @template TSelected 选择器返回的数据类型
 * @param {Function} selector 选择器函数，从Redux状态中提取数据
 * @returns {TSelected} 选择的状态部分
 * @example
 * const counter = useAppSelector(state => state.counter);
 */
export const useAppSelector = useSelector; 