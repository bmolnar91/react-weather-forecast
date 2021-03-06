﻿import React, { useState, useEffect } from "react";
import styled from "styled-components";
import WeatherDetails from "../WeatherDetails";
import axios from "axios";

const FavoriteLocations = () => {
  const [state, setState] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_FAVORITES_URL}`).then((res) => {
      setState(res.data);
    });
  }, []);

  return (
    <CardHolder>
      {state.map((item) => (
        <WeatherDetails item={item} key={item.id} />
      ))}
    </CardHolder>
  );
};

const CardHolder = styled.div`
  display: flex;
  margin: 20px;
  padding: 10px;
  height: auto;
  flex-wrap: wrap;
`;

export default FavoriteLocations;
