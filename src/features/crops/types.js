export const CROPS_ALL_URL = "/crops/all";
export const USER_CROPS_USER_URL = (userId) => `/usercrops/user/${userId}`;
export const USER_CROPS_SELECT_URL = "/usercrops/select";
export const USER_CROPS_DESELECT_URL = "/usercrops/deselect";
export const USER_CROPS_UPDATE_URL = (id) => `/usercrops/update/${id}`;
export const CROPS_DETAIL_URL = (cropId) => `/crops/${cropId}`;

export const INITIAL_CROP_DATA = {
    name: "",
    minTemperature: 0,
    maxTemperature: 0,
    minHumidity: 0,
    maxHumidity: 0,
    minSoilMoisture: 0,
    maxSoilMoisture: 0,
};
