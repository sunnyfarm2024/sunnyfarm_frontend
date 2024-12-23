import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PlantBook.css";
import placeholderImg from "../../assets/images/plantbook/pb-n-img.png";
import closeBtn from "../../assets/button/closeBtn.png";
import leftBtn from '../../assets/images/plantbook/pb-2.png';
import rightBtn from '../../assets/images/plantbook/pb-1.png';

function PlantBook({ onClose }) {
  const [plants, setPlants] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get("http://localhost:8080/plant/book");
        let plantData = response.data;

        // 홀수 개수일 경우 빈 카드 추가
        if (plantData.length % 2 !== 0) {
          plantData = [...plantData, { plantImage: "placeholder", plantDescription: "" }];
        }

        setPlants(plantData);
      } catch (error) {
        console.error("Error fetching plant book data:", error);
      }
    };

    fetchPlants();
  }, []);

  const totalPages = Math.ceil(plants.length / 2);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * 2;
  const currentPlants = plants.slice(startIndex, startIndex + 2);

  return (
    <div className="plantbook-popup" onClick={onClose}>
      <div className="plantbook-content" onClick={(e) => e.stopPropagation()}>
        <button
          className={`nav-button left-button ${currentPage === 0 ? "disabled" : ""}`}
          onClick={goToPrevPage}
          disabled={currentPage === 0}
        >
          <img src={leftBtn}/>
        </button>
        <div className="plantbook-display">
          <div className="plantbook-card left">
            {currentPlants[0] && (
              <>
                <div className="plantbook-image">
                  {currentPlants[0].plantImage !== "placeholder" ? (
                    <img 
                      src={`http://localhost:8080${currentPlants[0].plantImage}`} 
                      alt="Plant" 
                    />
                  ) : (
                    <img className="none-img" src={placeholderImg} alt="Placeholder" />
                  )}
                </div>
                <div className="plantbook-description">
                  {currentPlants[0].plantDescription}
                </div>
              </>
            )}
          </div>
          <div className="plantbook-divider"></div>
          <div className="plantbook-card right">
            {currentPlants[1] && (
              <>
                <div className="plantbook-image">
                  {currentPlants[1].plantImage !== "placeholder" ? (
                    <img 
                      src={`http://localhost:8080${currentPlants[1].plantImage}`} 
                      alt="Plant" 
                    />
                  ) : (
                    <img className="none-img" src={placeholderImg} alt="Placeholder" />
                  )}
                </div>
                <div className="plantbook-description">
                  {currentPlants[1].plantDescription}
                </div>
              </>
            )}
          </div>
        </div>
        <button
          className={`nav-button right-button ${currentPage === totalPages - 1 ? "disabled" : ""}`}
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
        >
          <img src={rightBtn}/>
          </button>
        <button className="plantbook-close-button" onClick={onClose}>
          <img src={closeBtn} alt="닫기 버튼" />
        </button>
      </div>
    </div>
  );
}

export default PlantBook;
