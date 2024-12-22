import React from "react";
import "./TitleSelectionModal.css";

const TitleSelectionModal = ({ currentTitle, onSelect, onClose }) => {
    const titles = ["초보 농부", "중급 농부", "고급 농부", "마스터 농부"]; // 타이틀 리스트

    return (
        <div className="title-modal-overlay">
            <div className="title-modal-container">
                <h2>칭호 선택</h2>
                <ul className="title-list">
                    {titles.map((title) => (
                        <li
                            key={title}
                            className={`title-item ${
                                title === currentTitle ? "selected" : ""
                            }`}
                            onClick={() => onSelect(title)} // 타이틀 선택 시 호출
                        >
                            {title}
                        </li>
                    ))}
                </ul>
                <button className="title-close-button" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default TitleSelectionModal;
