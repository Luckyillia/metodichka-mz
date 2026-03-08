"use client"

import { useState, useMemo } from "react"
import ExamplePhrase from "../../ExamplePhrase"
import { Search, X, Pill, AlertCircle } from "lucide-react"

const medications = [
  { symptom: "Headache", medicine: "Mig", gender: "its" },
  { symptom: "Migraines", medicine: "Amigrenin", gender: "its" },
  { symptom: "Seizures, nervous tic", medicine: "Asparkam", gender: "its" },
  { symptom: "Stomach pain", medicine: "Noshpa", gender: "its" },
  { symptom: "Nausea", medicine: "Dramina", gender: "its" },
  { symptom: "Heartburn", medicine: "Almagel", gender: "its" },
  { symptom: "Liver pain", medicine: "Hepabene", gender: "its" },
  { symptom: "Heart pain", medicine: "Cardiomagnil", gender: "its" },
  { symptom: "Cold and fever", medicine: "Theraflu", gender: "its" },
  { symptom: "Cough", medicine: "Lazolvan", gender: "its" },
  { symptom: "Wet cough with phlegm", medicine: "Ambrobene", gender: "its" },
  { symptom: "Runny nose", medicine: "Tizin", gender: "its" },
  { symptom: "Sore throat - sprays", medicine: "Hexoral", gender: "its" },
  { symptom: "Eye pain", medicine: "Visine", gender: "its" },
  { symptom: "Ear pain", medicine: "Otinum", gender: "its" },
  { symptom: "Kidney pain", medicine: "Urohol", gender: "its" },
  { symptom: "Bladder", medicine: "Cyston", gender: "its" },
  { symptom: "Back, leg and joint pain - ointment", medicine: "Fastum-gel", gender: "its" },
  { symptom: "Hemorrhoids - suppositories", medicine: "Natalsid", gender: "its" },
  { symptom: "Diabetes", medicine: "Victoza", gender: "its" },
  { symptom: "Bruises and abrasions", medicine: "Dolobene", gender: "its" },
  { symptom: "Vitamins", medicine: "Vitamix", gender: "its" },
  { symptom: "High blood pressure", medicine: "Andipal", gender: "its" },
  { symptom: "Low blood pressure", medicine: "Norepinephrine", gender: "its" },
  { symptom: "Painkillers", medicine: "Paracetamol", gender: "its" },
  { symptom: "Potency enhancement", medicine: "Cialex", gender: "its" },
  { symptom: "Thrush", medicine: "Nystatin", gender: "its" },
  { symptom: "Diarrhea", medicine: "Loperamide", gender: "its" },
  { symptom: "Constipation", medicine: "Linex Forte", gender: "its" },
  { symptom: "Insomnia", medicine: "Nightwell", gender: "its" },
  { symptom: "Asthma attacks", medicine: "Salbutamol", gender: "its" },
  { symptom: "Stress", medicine: "Tenoten", gender: "its" },
]

const specialMedications = [
  {
    symptom: "Allergy",
    medicines: "Cetrin, Claritin, Erius, Zodak, Tavegil, Loratadine",
    note: "After emergency care, a test must be taken",
  },
  {
    symptom: "Loss of consciousness",
    medicines: "Ammonia",
    note: "Moisten cotton with ammonia and hold under the patient's nose",
  },
  {
    symptom: "Burns",
    medicines: "Bepanten",
    note: "It is advisable to cover the burn with antibacterial dressing Cosmopor",
  },
]

const MedicationsSection = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMedications = useMemo(() => {
    if (!searchQuery.trim()) return medications
    const query = searchQuery.toLowerCase()
    return medications.filter(item => 
      item.symptom.toLowerCase().includes(query) || 
      item.medicine.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const filteredSpecialMedications = useMemo(() => {
    if (!searchQuery.trim()) return specialMedications
    const query = searchQuery.toLowerCase()
    return specialMedications.filter(item => 
      item.symptom.toLowerCase().includes(query) || 
      item.medicines.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const clearSearch = () => setSearchQuery("")

  return (
    <div className="space-y-6">
      {/* Price notice */}
      <div className="bg-card border border-border rounded-lg p-4 border-l-3 border-l-primary">
        <div className="flex items-center gap-3">
          <Pill className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Price:</span> All medications cost 500 rubles
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by symptom or medication name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 text-sm rounded-md border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {searchQuery && (
        <p className="text-xs text-muted-foreground">
          Found: {filteredMedications.length + filteredSpecialMedications.length} results
        </p>
      )}

      {/* Medications list */}
      <div className="space-y-3">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((item, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
              <h4 className="text-sm font-medium text-foreground mb-2">{item.symptom}</h4>
              <ExamplePhrase text={`say I'll prescribe you ${item.medicine}, ${item.gender} cost is 500 rubles, do you agree?`} />
            </div>
          ))
        ) : searchQuery ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No results found for "{searchQuery}" in the main list
          </div>
        ) : null}
      </div>

      {/* Special cases */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Special Cases</h3>
        <div className="space-y-3">
          {filteredSpecialMedications.length > 0 ? (
            filteredSpecialMedications.map((item, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <h4 className="text-sm font-medium text-foreground mb-2">{item.symptom}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  <span className="font-medium text-foreground">Medications:</span> {item.medicines}
                </p>
                <div className="flex items-start gap-2 p-3 bg-accent rounded-md border-l-2 border-primary">
                  <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
              </div>
            ))
          ) : searchQuery ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No results found for "{searchQuery}" in special cases
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default MedicationsSection
