"use client";

import { useState } from "react";

type FormData = {
  // Step 1: Student Info
  hostelType: string;
  
  // Step 2: Housing & Energy
  timeInHostel: number;
  poweredEquipment: number;
  chargingHours: number;
  sharedAppliances: string;
  
  // Step 3: Food & Diet
  dietType: string;
  mealsWithMeat: number;
  foodWaste: string;
  
  // Step 4: Transportation
  transportationMode: string;
  weeklyCommuteDistance: number;
  flightsPerYear: number;
  
  // Step 5: Water Usage
  dailyShowerMinutes: number;
  laundryFrequency: string;
  waterBottlesUsed: number;
};

export default function CarbonFootprintCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState<{
    totalEmissions: number;
    breakdown: Record<string, number>;
    classification: string;
    recommendations: string[];
  } | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    hostelType: "",
    
    // Step 2
    timeInHostel: 18,
    poweredEquipment: 25,
    chargingHours: 6,
    sharedAppliances: "",
    
    // Step 3
    dietType: "omnivore",
    mealsWithMeat: 10,
    foodWaste: "some",
    
    // Step 4
    transportationMode: "walking",
    weeklyCommuteDistance: 0,
    flightsPerYear: 0,
    
    // Step 5
    dailyShowerMinutes: 10,
    laundryFrequency: "weekly",
    waterBottlesUsed: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.endsWith("Hours") || name.endsWith("Equipment") ? Number(value) : value
    }));
  };

  const calculateFootprint = () => {
    // Simulate calculation delay
    setTimeout(() => {
      // Calculate emissions for each category (simplified example)
      const housingEmissions = 
        (formData.timeInHostel * 0.5) + 
        (formData.poweredEquipment * 0.2) + 
        (formData.chargingHours * 0.1) + 
        (formData.sharedAppliances === 'often' ? 2 : formData.sharedAppliances === 'sometimes' ? 1 : 0);
      
      const foodEmissions = 
        formData.mealsWithMeat * 2.5 + 
        (formData.dietType === 'vegan' ? 0 : formData.dietType === 'vegetarian' ? 5 : 10);
      
      const transportEmissions = 
        (formData.weeklyCommuteDistance * 52 * 
          (formData.transportationMode === 'car' ? 0.2 : 
           formData.transportationMode === 'motorbike' ? 0.1 : 0.02)) +
        (formData.flightsPerYear * 200);
      
      const waterEmissions = 
        (formData.dailyShowerMinutes * 0.1) + 
        (formData.waterBottlesUsed * 0.2);
      
      const totalEmissions = housingEmissions + foodEmissions + transportEmissions + waterEmissions;
      
      // Generate recommendations
      const recommendations: string[] = [];
      
      if (formData.mealsWithMeat > 10) {
        recommendations.push("Try having at least 2 meat-free days per week to reduce your food-related emissions.");
      }
      
      if (formData.transportationMode === 'car' && formData.weeklyCommuteDistance > 50) {
        recommendations.push("Consider carpooling or using public transport to reduce your transportation emissions.");
      }
      
      if (formData.waterBottlesUsed > 5) {
        recommendations.push("Switch to a reusable water bottle to reduce plastic waste and associated emissions.");
      }
      
      if (formData.dailyShowerMinutes > 10) {
        recommendations.push("Try reducing your shower time to save water and energy.");
      }
      
      // Add more recommendations based on other factors
      
      setResults({
        totalEmissions,
        breakdown: {
          'Housing': housingEmissions,
          'Food': foodEmissions,
          'Transportation': transportEmissions,
          'Water & Waste': waterEmissions,
        },
        classification: 
          totalEmissions < 1000 ? 'Excellent! Below average footprint' :
          totalEmissions < 2000 ? 'Good! Average footprint' :
          totalEmissions < 3000 ? 'Above average - Room for improvement' :
          'High - Consider making some changes',
        recommendations: recommendations.length > 0 ? recommendations : [
          "Your carbon footprint is already quite low! Keep up the good work by maintaining these habits."
        ],
      });
      
      // Move to results step
      setCurrentStep(6);
    }, 1000);
  };

  const nextStep = () => {
    if (currentStep === 5) {
      calculateFootprint();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">1</div>
              <h2 className="text-2xl font-bold text-gray-800">Student Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">1. Which hostel do you live in?</label>
                <div className="space-y-2">
                  {[
                    { value: "boys_hostel_1", label: "Boys Hostel 1" },
                    { value: "boys_hostel_2", label: "Boys Hostel 2" },
                    { value: "girls_hostel_1", label: "Girls Hostel 1" },
                    { value: "girls_hostel_2", label: "Girls Hostel 2" },
                    { value: "pg_accommodation", label: "PG/Off-campus" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="hostelType"
                        value={option.value}
                        checked={formData.hostelType === option.value}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">2</div>
              <h2 className="text-2xl font-bold text-gray-800">Housing & Energy</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  2. Time spent in hostel per day? ({formData.timeInHostel} hours)
                </label>
                <input
                  type="range"
                  name="timeInHostel"
                  min="8"
                  max="24"
                  value={formData.timeInHostel}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  3. Hours per week in classrooms/labs/studios with powered equipment? ({formData.poweredEquipment} hours)
                </label>
                <input
                  type="range"
                  name="poweredEquipment"
                  min="0"
                  max="80"
                  value={formData.poweredEquipment}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  4. How many hours do you charge your phone/laptop daily? ({formData.chargingHours} hours)
                </label>
                <input
                  type="range"
                  name="chargingHours"
                  min="1"
                  max="10"
                  value={formData.chargingHours}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  5. How often do you use shared appliances (kettle, iron, induction stove)?
                </label>
                <div className="space-y-2">
                  {[
                    { value: "never", label: "Never" },
                    { value: "rarely", label: "Rarely (1-2 times per week)" },
                    { value: "sometimes", label: "Sometimes (3-5 times per week)" },
                    { value: "often", label: "Often (daily or more)" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="sharedAppliances"
                        value={option.value}
                        checked={formData.sharedAppliances === option.value}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">3</div>
              <h2 className="text-2xl font-bold text-gray-800">Food & Diet</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">6. What best describes your diet?</label>
                <select
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="omnivore">Omnivore (meat occasionally)</option>
                  <option value="meatHeavy">Heavy meat consumption</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  7. How many meals per week include meat? ({formData.mealsWithMeat} meals)
                </label>
                <input
                  type="range"
                  name="mealsWithMeat"
                  min="0"
                  max="21"
                  value={formData.mealsWithMeat}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">8. How much food do you typically waste?</label>
                <div className="space-y-2">
                  {[
                    { value: "none", label: "None - I eat everything I take" },
                    { value: "some", label: "Some - I occasionally waste small amounts" },
                    { value: "moderate", label: "Moderate - I often leave food uneaten" },
                    { value: "a-lot", label: "A lot - I frequently throw away food" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="foodWaste"
                        value={option.value}
                        checked={formData.foodWaste === option.value}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">4</div>
              <h2 className="text-2xl font-bold text-gray-800">Transportation</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">9. Your primary mode of transportation?</label>
                <select
                  name="transportationMode"
                  value={formData.transportationMode}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="walking">Walking</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="public">Public Transport</option>
                  <option value="car">Car</option>
                  <option value="motorbike">Motorbike</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  10. Weekly commute distance (km)? ({formData.weeklyCommuteDistance} km)
                </label>
                <input
                  type="range"
                  name="weeklyCommuteDistance"
                  min="0"
                  max="500"
                  value={formData.weeklyCommuteDistance}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  11. Number of flights per year? ({formData.flightsPerYear} flights)
                </label>
                <input
                  type="range"
                  name="flightsPerYear"
                  min="0"
                  max="20"
                  value={formData.flightsPerYear}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">5</div>
              <h2 className="text-2xl font-bold text-gray-800">Water Usage</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  12. Average daily shower time? ({formData.dailyShowerMinutes} minutes)
                </label>
                <input
                  type="range"
                  name="dailyShowerMinutes"
                  min="2"
                  max="30"
                  value={formData.dailyShowerMinutes}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">13. How often do you do laundry?</label>
                <select
                  name="laundryFrequency"
                  value={formData.laundryFrequency}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="rarely">Rarely (less than once a week)</option>
                  <option value="weekly">Weekly</option>
                  <option value="twice">Twice a week</option>
                  <option value="frequent">Every few days</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  14. Plastic water bottles used per week? ({formData.waterBottlesUsed} bottles)
                </label>
                <input
                  type="range"
                  name="waterBottlesUsed"
                  min="0"
                  max="20"
                  value={formData.waterBottlesUsed}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Your Carbon Footprint Results
              </h2>
              <p className="text-gray-600 mt-2">Here&apos;s how your lifestyle impacts the environment</p>
            </div>
            
            {results ? (
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl border border-blue-100 shadow-inner">
                <div className="text-center mb-8">
                  <div className="inline-flex items-baseline mb-2">
                    <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                      {results.totalEmissions.toFixed(0)}
                    </span>
                    <span className="ml-2 text-2xl font-medium text-gray-600">kg CO₂/year</span>
                  </div>
                  <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-white text-blue-600 shadow-sm">
                    {results.classification}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800">Emissions Breakdown</h3>
                    <span className="text-sm text-blue-600 font-medium">kg CO₂/year</span>
                  </div>
                  {Object.entries(results.breakdown).map(([category, value]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="font-semibold">{value.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500" 
                          style={{ width: `${(value / results.totalEmissions) * 100}%` }}
                        ></div>
                      </div>      
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Personalized Recommendations
                  </h3>
                  <ul className="space-y-4">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <p className="ml-3 text-gray-700">{rec}</p>
                      </li>
                    ))}
                  </ul>      
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-r-blue-500 border-b-green-500 border-l-blue-500 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-green-200"></div>
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-green-100 to-blue-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Calculating your impact</h3>
                <p className="text-gray-600 max-w-md mx-auto">Analyzing your responses to provide personalized results...</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Background pattern component
  const BackgroundPattern = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden opacity-20">
      {/* Leaf patterns */}
      <div className="absolute top-1/4 left-1/4 w-12 h-12 text-green-500 animate-float">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-1/5 w-8 h-8 text-blue-400 animate-float animation-delay-1000">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,3C12,3 22,10 22,12C22,14 19,16 16,16C13,16 13,18 16,22H8C11,18 11,16 8,16C5,16 2,14 2,12C2,10 12,3 12,3Z" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 left-1/5 w-10 h-10 text-green-400 animate-float animation-delay-1500">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,18.54L19.37,12.8L21,14.07L12,21.07L3,14.07L4.62,12.81L12,18.54M12,16L3,9L12,2L21,9L12,16" />
        </svg>
      </div>
      <div className="absolute bottom-1/3 right-1/4 w-6 h-6 text-blue-500 animate-float animation-delay-2000">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
        </svg>
      </div>
      <div className="absolute top-1/5 right-1/3 w-7 h-7 text-green-600 animate-float animation-delay-2500">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />
        </svg>
      </div>
      {/* Dotted grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackgroundPattern />
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12 transform transition-all duration-300 hover:scale-105">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-4">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-3">
            Carbon Footprint Calculator
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
            Take a few minutes to discover your environmental impact and receive personalized recommendations to reduce your carbon footprint.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10 px-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round((currentStep / 5) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Step {currentStep} of 5</span>
            {currentStep < 5 && (
              <span className="text-xs font-medium text-blue-600">
                {currentStep === 1 && 'Student Info'}
                {currentStep === 2 && 'Housing & Energy'}
                {currentStep === 3 && 'Food & Diet'}
                {currentStep === 4 && 'Transportation'}
                {currentStep === 5 && 'Water Usage'}
              </span>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl border border-gray-100">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:-translate-x-0.5'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
            >
              {currentStep === 5 ? '🌱 Calculate My Footprint' : 'Continue'}
              {currentStep < 5 && (
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
