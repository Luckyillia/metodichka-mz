"use client"

import { useState } from "react"
import { Car, Plane, X, ExternalLink } from "lucide-react"

interface Vehicle {
  name: string
  imageUrl: string
  minRank: number
  rankName: string
  description?: string
  specs?: {
    maxSpeed?: string
    acceleration100?: string
    accelerationMax?: string
    seats?: string
    ceiling?: string
    climbRate?: string
  }
  purpose?: string
}

const vehicles: Vehicle[] = [
  {
    name: "ГАЗель NEXT (Луидор 2250с4)",
    imageUrl: "https://i.imgur.com/M9H3PRS.jpeg",
    minRank: 3,
    rankName: "Лаборант",
    description: "Стандартная машина скорой помощи",
    specs: {
      maxSpeed: "129 км/ч",
      acceleration100: "15 секунд",
      accelerationMax: "25.5 секунд"
    },
    purpose: "Используется для дежурства на мобильных постах, патрулирования Республики и города, выезда на вызовы."
  },
  {
    name: "ГАЗель NEXT (Луидор 2250с4 Реанимация)",
    imageUrl: "https://i.imgur.com/ao6ZklI.jpeg",
    minRank: 3,
    rankName: "Лаборант",
    description: "Реанимобиль для экстренных случаев",
    specs: {
      maxSpeed: "129 км/ч",
      acceleration100: "15 секунд",
      accelerationMax: "25.5 секунд"
    },
    purpose: "Используется для выезда на экстренные вызовы."
  },
  {
    name: "ПАЗ-32053",
    imageUrl: "https://i.imgur.com/rmY52HP.png",
    minRank: 8,
    rankName: "Заведующий Отделением",
    description: "Автобус для массовых перевозок",
    specs: {
      maxSpeed: "90 км/ч",
      accelerationMax: "24.3 секунды",
      seats: "40 мест"
    },
    purpose: "Используется для массовой транспортировки сотрудников больниц."
  },
  {
    name: "Вертолет Bell-206",
    imageUrl: "https://i.imgur.com/z22lycc.png",
    minRank: 7,
    rankName: "Пилот Санитарной Авиации",
    description: "Санитарная авиация для срочной эвакуации",
    specs: {
      maxSpeed: "120 км/ч",
      ceiling: "4155 метров",
      climbRate: "6.5 м/c"
    },
    purpose: "Используется для вылета в патрулирование Республики, вылета на срочные и труднодоступные вызовы."
  }
]

export default function VehiclesSection() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Car className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Транспорт Министерства Здравоохранения</h2>
          <p className="text-sm text-muted-foreground">Доступный транспорт в зависимости от ранга</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((vehicle, index) => (
          <div
            key={index}
            className="modern-card p-6 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                {vehicle.name.includes("Вертолет") ? (
                  <Plane className="w-6 h-6 text-primary" />
                ) : (
                  <Car className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {vehicle.name}
                </h3>
                {vehicle.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {vehicle.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full font-medium">
                    {vehicle.minRank}+ ранг
                  </span>
                  <span className="text-muted-foreground">
                    ({vehicle.rankName})
                  </span>
                </div>
              </div>
            </div>

            {/* Технические характеристики */}
            {vehicle.specs && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Технические характеристики</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {vehicle.specs.maxSpeed && (
                    <div>
                      <span className="text-muted-foreground">Макс. скорость:</span>
                      <p className="font-medium text-foreground">{vehicle.specs.maxSpeed}</p>
                    </div>
                  )}
                  {vehicle.specs.acceleration100 && (
                    <div>
                      <span className="text-muted-foreground">Разгон до 100:</span>
                      <p className="font-medium text-foreground">{vehicle.specs.acceleration100}</p>
                    </div>
                  )}
                  {vehicle.specs.accelerationMax && (
                    <div>
                      <span className="text-muted-foreground">Разгон до макс:</span>
                      <p className="font-medium text-foreground">{vehicle.specs.accelerationMax}</p>
                    </div>
                  )}
                  {vehicle.specs.seats && (
                    <div>
                      <span className="text-muted-foreground">Мест:</span>
                      <p className="font-medium text-foreground">{vehicle.specs.seats}</p>
                    </div>
                  )}
                  {vehicle.specs.ceiling && (
                    <div>
                      <span className="text-muted-foreground">Потолок:</span>
                      <p className="font-medium text-foreground">{vehicle.specs.ceiling}</p>
                    </div>
                  )}
                  {vehicle.specs.climbRate && (
                    <div>
                      <span className="text-muted-foreground">Скороподъемность:</span>
                      <p className="font-medium text-foreground">{vehicle.specs.climbRate}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Предназначение */}
            {vehicle.purpose && (
              <div className="mt-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <h4 className="text-xs font-semibold text-blue-400 mb-1 uppercase flex items-center gap-1">
                  <span>🎯</span> Предназначение
                </h4>
                <p className="text-sm text-foreground/80">{vehicle.purpose}</p>
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() => setSelectedVehicle(vehicle)}
                className="modern-button w-full"
              >
                Посмотреть изображение
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="modern-card p-6 bg-blue-500/5 border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xl">ℹ️</span>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Важная информация</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Транспорт доступен в зависимости от вашего ранга в организации</li>
              <li>• Для использования санитарной авиации требуется должность Пилота</li>
              <li>• Все транспортные средства должны использоваться строго по назначению</li>
              <li>• При использовании транспорта соблюдайте правила дорожного движения</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal with Image */}
      {selectedVehicle && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVehicle(null)}
        >
          <div 
            className="bg-popover rounded-lg border-2 border-border max-w-7xl w-full max-h-[95vh] overflow-hidden transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b-2 border-border">
              <div className="flex items-center gap-3">
                {selectedVehicle.name.includes("Вертолет") ? (
                  <Plane className="w-6 h-6 text-primary" />
                ) : (
                  <Car className="w-6 h-6 text-primary" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-popover-foreground">
                    {selectedVehicle.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedVehicle.rankName} ({selectedVehicle.minRank}+ ранг)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4" style={{ height: 'calc(95vh - 100px)' }}>
              <div 
                className="flex-1 rounded-lg border-2 border-border bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${selectedVehicle.imageUrl})` }}
              />
              <div className="flex justify-center flex-shrink-0">
                <a
                  href={selectedVehicle.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modern-button flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Открыть в полном размере
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
