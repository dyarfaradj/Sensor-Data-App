const fetchData = async info => {
  if (!info) info = { long: "14.333", lat: "60.383" };
  return await fetch(
    "https://maceo.sth.kth.se/api/category/pmp3g/version/2/geotype/point/lon/" +
      info.long +
      "/lat/" +
      info.lat +
      "/"
  )
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error(error);
    });
};

export { fetchData };
