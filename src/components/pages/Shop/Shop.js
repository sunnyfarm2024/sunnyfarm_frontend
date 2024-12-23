import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import axios from "axios";
import BalanceBar from "../Main/BalanceBar";
import "./Shop.css";

import closeBtn from "../../assets/button/closeBtn.png";
import coinImg from "../../assets/images/shop/coin.png";
import diaImg from "../../assets/images/shop/dia.png";
import cashImg from "../../assets/images/shop/cash.png";

function Shop() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);
  const { status } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hasCalledPurchase = useRef(false);
  const user = location.state?.user; // 전달된 user 데이터를 가져옴

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  useEffect(() => {
    axiosInstance
      .get("/shop/list")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  useEffect(() => {
    if (status) {
      if (status === "success") {
        const queryParams = new URLSearchParams(location.search);
        const itemNameFromQuery = queryParams.get("itemName");

        if (!hasCalledPurchase.current && itemNameFromQuery) {
          hasCalledPurchase.current = true;
          console.log("ItemPurchase 호출", itemNameFromQuery);
          ItemPurchase(itemNameFromQuery);
        }
      } else if (status === "fail") {
        console.error("결제 실패 처리");
      }

      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate, location.search]);

  const filterItems = (category) => {
    setCategory(category);
  };

  const filteredItems =
    category === "ALL" ? items : items.filter((item) => item.itemCategory === category);

  const goToMain = () => {
    navigate("/main");
  };

  const confirmPurchase = async (item) => {
    if (!item || !item.itemName) {
      alert("구매할 아이템 정보가 없습니다.");
      return;
    }
  
    try {
      const response = await axiosInstance.get(`/shop/check?itemName=${item.itemName}`);
      await ItemPurchase(item.itemName); // 아이템 구매 요청
      alert(`${item.itemName} 구매 완료!`);
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data.check === "cash") {
        handlePayment(error.response.data); // 결제 처리
      } else {
        alert(error.response?.data.message || "구매 중 오류가 발생했습니다.");
      }
    }
  };
  
  const handlePayment = (item) => {
    const orderId = btoa(new Date().getTime() + Math.random());
    loadTossPayments("test_ck_yL0qZ4G1VOYz6wvYM6Oo8oWb2MQY")
      .then((tossPayments) => {
        tossPayments.requestPayment("카드", {
          amount: item.price,
          orderId,
          orderName: item.itemName,
          successUrl: `http://localhost:3000/shop/success?itemName=${item.itemName}`,
          failUrl: "http://localhost:3000/shop/fail",
        });
      })
      .catch((error) => {
        console.error("결제 요청 실패:", error.message);
        alert("결제 요청 중 오류가 발생했습니다.");
      });
  };

  const ItemPurchase = async (itemName) => {
    try {
      const response = await axiosInstance.post(`/shop/purchase?itemName=${itemName}`);
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data);
    }
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="shop-title text-outline" data-content="상점">상점</h1>
        <div className="shop-header-right">
        <div className="shop-balance">
           <BalanceBar user={user} />
        </div>
        <button className="shop-close-button" onClick={goToMain}>
          <img src={closeBtn} alt="닫기 버튼" />
        </button>
      </div>
      </div>
      <div className="shop-categories">
          {["ALL", "SEED", "FERTILIZER", "GNOME", "DECORATION", "CURRENCY"].map((cat) => (
            <button
              key={cat}
              onClick={() => filterItems(cat)}
              className={cat === category ? "active-category" : "inactive-category"} // 선택된 버튼 구분
            >
              {cat}
            </button>
          ))}
        </div>

      <div className="shop-items-container">
      <div className="shop-items">
        {filteredItems.map((item) => (
          <div key={item.itemName} className="shop-item">
            <img className="shop-item-img"
              src={item.itemImage !== "null" ? `http://localhost:8080${item.itemImage}` : "placeholder.png"}
              alt={item.itemName}
            />
            <div className="shop-item-info">
              <div className="shop-item-description">
              {item.itemCategory === "SEED" ? (
                <>
                  <p
                    className={`item-description text-outline ${
                      item.itemDescription.replace(new RegExp(item.itemName.split(/\s+/).join("\\s*"), "g"), "").trim().length > 10
                        ? "small-font"
                        : ""
                    }`}
                    data-content={item.itemDescription.replace(new RegExp(item.itemName.split(/\s+/).join("\\s*"), "g"), "").trim()}
                  >
                    {item.itemDescription.replace(new RegExp(item.itemName.split(/\s+/).join("\\s*"), "g"), "").trim()}
                  </p>
                  <h3
                    className="item-name text-outline"
                    data-content={item.itemName}
                  >
                    {item.itemName}
                  </h3>
                </>
              ) : (
                <>
                  <h3
                    className="item-name text-outline"
                    data-content={item.itemName}
                  >
                    {item.itemName}
                  </h3>
                  <p
                    className={`item-description text-outline ${
                      item.itemDescription.length > 10 ? "small-font" : ""
                    }`}
                    data-content={item.itemDescription}
                  >
                    {item.itemDescription}
                  </p>
                </>
              )}

              </div>

              <div className="price-container">
                <img
                    src={
                      item.currency === "COIN"
                        ? coinImg
                        : item.currency === "DIAMOND"
                        ? diaImg
                        : cashImg
                    }
                    alt={item.currency === "COIN" ? "코인" : item.currency === "DIAMOND" ? "다이아" : "캐시"}
                    className={`${
                      item.currency === "COIN"
                        ? "coin-img"
                        : item.currency === "DIAMOND"
                        ? "dia-img"
                        : "cash-img"
                    }`} />
              <button
                className={`${
                  item.currency === "COIN"
                    ? "coin-class"
                    : item.currency === "DIAMOND"
                    ? "diamond-class"
                    : "default-class"
                } text-outline`}
                data-content={item.price}
                onClick={() => confirmPurchase(item)} 
                >
                {item.price}
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      
    </div>
  );
}

export default Shop;
