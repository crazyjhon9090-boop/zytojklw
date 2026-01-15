import { useState } from 'react';
import '../styles/about-accordion.css';

const ITEMS = [
  {
    title: 'Cintra Advocacia',
    content:
      'Advogados Pai e Filho, com atuação pautada na excelência jurídica e no compromisso com a defesa dos direitos e garantias fundamentais de cada cliente.',
  },
  {
    title: 'Especialidades',
    content:
      'Atuação estratégica e técnica nas áreas Criminal, Civil e Juizados Especiais (Pequenas Causas), oferecendo suporte jurídico completo desde a consultoria até o contencioso.',
  },
  {
    title: 'Nossa Missão',
    content:
      'Proporcionar uma advocacia humana, ética e resolutiva, transformando desafios jurídicos em soluções seguras e eficazes para proteger o que é mais importante para você.',
  },
];


const AboutAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="about-accordion">
      {ITEMS.map((item, index) => (
        <div
          key={index}
          className={`accordion-item ${
            openIndex === index ? 'open' : ''
          }`}
        >
          <button
            className="accordion-header"
            onClick={() => toggle(index)}
          >
            {item.title}
            <span className="arrow">
              {openIndex === index ? '−' : '+'}
            </span>
          </button>

          <div className="accordion-content">
            <p>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutAccordion;

