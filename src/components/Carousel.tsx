import React, { useState, useEffect } from 'react';
import '../css/Carousel.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Массив баннеров с акциями
  const slides = [
    {
      id: 1,
      title: "Орбита",
      subtitle: "Найдете всё",
      description: "",
      buttonText: "Начать поиск",
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      image: "7d77eb15-d154-4ddc-aef1-d893d22afc98_3a6604c8-9890-4a79-905f-c7f358556aba.png"
    },
    {
      id: 2,
      title: "Скидки до 70%",
      subtitle: "При заказе от 3000₽",
      description: "Доставка по всей России",
      buttonText: "Заказать",
      backgroundColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      image: "49d30458-e526-4543-b184-73b0b9ea2d85_bf458f82-604e-4fd6-9744-1c1f1a561360.png"
    },
    {
      id: 3,
      title: "Новая коллекция",
      subtitle: "Осень-Зима 2024",
      description: "Уже в продаже",
      buttonText: "Купить",
      backgroundColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      image: "f14c11da-ea8d-4107-87f6-a83be5f6b32e_e85ff32c-3f6d-4c3b-8d28-c8511c268302.png"
    },
    {
      id: 4,
      title: "Подарок за покупку",
      subtitle: "Каждому покупателю",
      description: "Специальные условия",
      buttonText: "Получить",
      backgroundColor: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      image: "f8ad26c2-accc-4a15-8ae7-adb18558b39a_0b4ddb7b-c8de-4812-9206-7014905d5628.png"
    }
  ];

  // Автопрокрутка
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''} ${index < currentSlide ? 'prev' : 'next'}`}
            style={{ background: slide.backgroundColor }}
          >
            <div className="slide-content">
              <div className="text-content">
                <span className="badge">Акция</span>
                <h2 className="title">{slide.title}</h2>
                <h3 className="subtitle">{slide.subtitle}</h3>
                <p className="description">{slide.description}</p>
                <button className="cta-button">{slide.buttonText}</button>
              </div>
              <div className="image-container">
                <div
                  className="image-placeholder"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Кнопки управления */}
        <button className="carousel-btn prev-btn" onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="carousel-btn next-btn" onClick={nextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Индикаторы (точки) */}
        <div className="indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>

        {/* Прогресс-бар */}
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${(currentSlide + 1) / slides.length * 100}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;