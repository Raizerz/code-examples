import {
    FETCH_AREA_DETAIL_REQUEST,
    FETCH_AREA_DETAIL_SUCCESS,
    FETCH_AREA_DETAIL_FAILURE,
    SET_AREA_DETAIL_FROM_CACHE,
} from './actionTypes';
import { getAreaById } from './api';

export const fetchArea = (id) => 
  async (dispatch, getState) => {
    const { area } = getState();
    if (area.cachedAreas.length) {
      const cachedArea = area.cachedAreas.find(item => item.id == id);
      if (cachedArea) {
        dispatch({
          type: SET_AREA_DETAIL_FROM_CACHE,
          payload: cachedArea
        });
        return cachedArea;
      }
    }
    dispatch({
      type: FETCH_AREA_DETAIL_REQUEST,
    });
    try {
      const response = await getAreaById(id);
      dispatch({
        type: FETCH_AREA_DETAIL_SUCCESS,
        payload: response,
      });
      if (response.links.gallery) {
        await dispatch(fetchAreaGallery(id));
      }
      return response;
    } catch (error) {
      return dispatch({
        type: FETCH_AREA_DETAIL_FAILURE,
        error,
      });
    }
  }