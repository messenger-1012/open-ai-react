import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

import "./App.css";

const App = () => {
  const { TextArea } = Input;
  const [dotCount, setDotCount] = useState(0);
  const [search, setSearch] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDotCount((dotCount) => (dotCount + 1) % 5);
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = async () => {
    let responseData;
    try {
      const response = await axios.post(
        process.env.REACT_APP_OPENAI_API_ENDPOINT,
        {
          prompt: search,
          temperature: process.env.REACT_APP_TEMPERATURE,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      responseData = response.data.choices[0].text.trim();
      setChatHistory([
        ...chatHistory,
        { type: "user", message: search },
        { type: "bot", message: responseData },
      ]);
      setSearch("");
    } catch (e) {
      message.error(
        e.message || "Something went Wrong ,please try again later"
      );
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={{ span: 24 }} sm={{ span: 12 }}>
          <TextArea
            placeholder={`Ask me Anything ${".".repeat(dotCount)}`}
            className="textarea"
            onChange={(event) => setSearch(event.target.value)}
          />
          <div
            className="search-button"
            style={{ display: "flex", justifyContent: "center", marginTop: 16 }}
          >
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 12 }}>
          <TextArea
            className="textarea2"
            readOnly
            value={chatHistory
              .map((item) => `[${item.type}] ${item.message}`)
              .join("\n")}
          />
        </Col>
      </Row>
    </div>
  );
};

export default App;
