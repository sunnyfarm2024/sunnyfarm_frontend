import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InventoryModal.css";
import closeBtn from "../../assets/button/closeBtn.png";
import InventoryDetailsModal from "./InventoryDetailsModal";

const InventoryModal = ({ 
  plants, 
  activateChoiceForEmptySlots, 
  activateChoiceForActiveSlots, 
  selectedLocation, 
  selectedName,     
  onClose }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/inventory/info", {
          withCredentials: true,
        });
        setInventoryItems(response.data);
      } catch (error) {
        console.error(
          "인벤토리 데이터 가져오기 오류:",
          error.response?.data || error.message
        );
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  useEffect(() => {
  }, [selectedLocation, selectedName]);
  
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetailsModal = () => {
    setSelectedItem(null);
  };

  const handleUseItem = async () => {
    const category = selectedItem.inventoryItemCategory;

    if (category === "SEED") {
      const farmLocations = ['left', 'center', 'right'];

      // 빈 슬롯 찾기
      const emptyLocation = farmLocations.find(
        (location) => !plants.some((plant) => plant.plantLocation === location)
      );

      if (!emptyLocation) {
        alert("농장에 심을 수 있는 공간이 없습니다.");
        handleCloseDetailsModal();
        return;
      }
    
      handleCloseDetailsModal();
      onClose();
      // 빈 슬롯 선택 모드 활성화
      activateChoiceForEmptySlots(async (location, plantName) => {
        if (!location || !plantName) {
          alert("위치나 이름이 선택되지 않았습니다.");
          return;
        }
        try {
          await callUseItemApi({ location, plantName });
        } catch (error) {
          console.error("씨앗 심기 중 오류 발생:", error.response?.data || error.message);
          alert("씨앗을 심는 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      });
    } else if (category === "FERTILIZER") {
      const farmLocations = ['left', 'center', 'right'];
      const activePlantExists = farmLocations.some((location) =>
        plants.some((plant) => plant.plantLocation === location)
      );
    
      if (!activePlantExists) {
        alert("농장에 식물이 없습니다.");
        handleCloseDetailsModal();
        return;
      }
    
      handleCloseDetailsModal();
      onClose();
    
      // 활성화된 슬롯 선택 모드 활성화
      activateChoiceForActiveSlots(async (location) => {
        if (!location) {
          alert("위치가 선택되지 않았습니다.");
          return;
        }
    
        // `location`에 따라 FertilizerAt 속성 확인
        const fertilizerAtKey = `${location}FertilizerAt`; // ex: "leftFertilizerAt"
        const fertilizerAt = selectedItem[fertilizerAtKey]
          ? new Date(selectedItem[fertilizerAtKey])
          : null;
        const currentTime = new Date();
    
        // FertilizerAt 값이 null이거나 만료된 경우
        if (!fertilizerAt || fertilizerAt <= currentTime) {
          try {
            await callUseItemApi({ location });
          } catch (error) {
            console.error("영양제 사용 중 오류 발생:", error.response?.data || error.message);
            alert("영양제 사용 중 오류가 발생했습니다. 다시 시도해주세요.");
          }
        } else {
          // FertilizerAt 값이 유효한 경우 교체 여부 확인
          const confirmReplace = window.confirm(
            "이미 다른 영양제를 적용 중입니다. 선택한 영양제로 교체할까요?"
          );
          if (confirmReplace) {
            try {
              await callUseItemApi({ location });
            } catch (error) {
              console.error("영양제 교체 중 오류 발생:", error.response?.data || error.message);
              alert("영양제 교체 중 오류가 발생했습니다. 다시 시도해주세요.");
            }
          } else {
            console.log("Fertilizer replacement canceled.");
          }
        }
      });
    }
    
     else if (category === "GNOME") {
      const gnomeAt = selectedItem.gnomeAt;
      if (!gnomeAt) {
        await callUseItemApi({});
      } else {
        const currentTime = new Date();
        const gnomeTime = new Date(gnomeAt);
        if (gnomeTime > currentTime) {
          const confirmReplace = window.confirm(
            "이미 다른 노움을 고용 중입니다. 선택한 노움으로 교체할까요?"
          );
          if (confirmReplace) {
            await callUseItemApi({});
          }
        } else {
          await callUseItemApi({});
        }
      }
    } else if (category === "DECORATION") {
      // DECORATION 카테고리 처리
      try {
        await callUseItemApi({});
        handleCloseDetailsModal();
        onClose();
      } catch (error) {
        console.error("DECORATION 배치 중 오류 발생:", error.response?.data || error.message);
        alert("아이템을 배치하는 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const callUseItemApi = async ({ location = null, plantName = null }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/inventory/use",
        null,
        {
          params: {
            slotNumber: selectedItem.slotNumber,
            location: location || "default",
            plantName: plantName || "default",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error("아이템 사용 중 오류 발생:", error.response?.data || error.message);
      alert("아이템을 사용하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleDiscardItem = async () => {
    if (!selectedItem) {
      alert("삭제할 아이템이 선택되지 않았습니다.");
      return;
    }

    const confirmDelete = window.confirm(
      `${selectedItem.inventoryItemName}을(를) 정말로 버리시겠습니까?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/inventory/delete",
        null,
        {
          params: { slotNumber: selectedItem.slotNumber },
          withCredentials: true,
        }
      );

      setInventoryItems((prevItems) =>
        prevItems.filter((item) => item.slotNumber !== selectedItem.slotNumber)
      );
      setSelectedItem(null);
    } catch (error) {
      console.error("아이템 삭제 오류:", error.response?.data || error.message);
      alert("아이템을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="inventory-modal-overlay">
      <div className="inventory-modal-container">
        <button className="inventory-modal-close" onClick={onClose}>
          <img src={closeBtn} alt="닫기 버튼" />
        </button>
        <h2 className="inventory-title text-outline" data-content="인벤토리">
          인벤토리
        </h2>

        <div className="inventory-modal-content">
          {loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ul>
              {inventoryItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleItemClick(item)}
                >
                  {item.inventoryItemImg ? (
                    <img
                      src={`http://localhost:8080${item.inventoryItemImg}`}
                      alt={item.inventoryItemName}
                    />
                  ) : (
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                      }}
                    >
                      없음
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <InventoryDetailsModal
        selectedItem={selectedItem}
        onClose={handleCloseDetailsModal}
        onUseItem={handleUseItem}
        onDiscardItem={handleDiscardItem}
      />
    </div>
  );
};

export default InventoryModal;
