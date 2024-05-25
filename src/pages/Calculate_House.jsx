import React, {useState, useEffect, useCallback} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Calculate_House() {

    const navigate = useNavigate()

    // states
    const [people, setPeople] = useState('')
    const [energyUsage, setEnergyUsage] = useState('');
    const [transportation, setTransportation] = useState('');
    const [wasteGeneration, setWasteGeneration] = useState('');
    const [foodConsumption, setfoodConsumption] = useState('');
    const [waterUsage, setWaterUsage] = useState('')
    const [carbonFootprintCalculated, setCarbonFootprintCalculated] = useState(null);

    const [toucanTokenPrice, setToucanTokenPrice] = useState(0);
    const [requiredToucanTokensCalculated, setRequiredToucanTokens] = useState(0)
    const [costCalculated, setCost] = useState(0)


    const calculateCarbonFootprint = useCallback(() => {

        const energyEmissionFactor = 0.0007867;     //  kg CO2e per kWh
        const transportationEmissionFactor = 2.31;   // kg CO2e per liter for gasoline vehicles
        const wasteEmissionFactor = 1.2;         // kg CO2e per kg
        const foodConsumptionEmissionFactor = 12.5;     // kg CO2e per kg
        const waterUsageEmissionFactor = 0.5;   // 

        const totalEmissions = 
        ((parseFloat(energyUsage) * energyEmissionFactor) + 
        (parseFloat(transportation) * transportationEmissionFactor) + 
        (parseFloat(wasteGeneration) * wasteEmissionFactor) +
        (parseFloat(foodConsumption) * foodConsumptionEmissionFactor) +
        (parseFloat(waterUsage) * waterUsageEmissionFactor));

        setCarbonFootprintCalculated(totalEmissions)
        return totalEmissions
    }, [energyUsage, transportation, wasteGeneration, foodConsumption, waterUsage])


    // Using an API to fetch the current price of Toucan tokens : 
    async function fetchToucanTokenPrice() {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=toucan-protocol-base-carbon-tonne&vs_currencies=inr')
        const data = await response.json()
        return data['toucan-protocol-base-carbon-tonne'].inr;
    }

    useEffect(() => {
        fetchToucanTokenPrice().then(price => setToucanTokenPrice(price));
    }, [])


    useEffect(() => {
        if (carbonFootprintCalculated !== null) {
            const requiredTokens = carbonFootprintCalculated / 1000;     // 1 token = 1 tCO2e
            setRequiredToucanTokens(requiredTokens);
            setCost(requiredTokens * toucanTokenPrice);
        }
    }, [carbonFootprintCalculated, toucanTokenPrice]);


    // Handle submitting the form
    const handleSubmit = (event) => {
        event.preventDefault();
        const footprint = calculateCarbonFootprint();
        const requiredTokens = footprint / 1000; // 1 token = 1 tCO2e
        const totalCost = requiredTokens * toucanTokenPrice;
    
        navigate('/result-household', {
            state: {
                carbonFootprintCalculated : footprint,
                requiredToucanTokensCalculated: requiredTokens,
                costCalculated : totalCost,
        },
        });
    };


    return(
        <main>

            <div className="bg-[url('../../public/images/individual_impact.jpg')] bg-center bg-no-repeat bg-cover text-white h-40 p-3">
                <h2 className="mb-7 capitalize">
                    Carbon Footprint Calculator
                </h2>

                <p className="text-[50px] leading-[0.87] text-center uppercase">
                    Household Impact
                </p>
            </div>

            <div className="text-center m-6 mt-24 text-4xl font-semibold font-sans">For a month : </div>

            <div className="relative flex items-top justify-center min-h-[500px] bg-white sm:items-center sm:pt-0">
                
                <form  
                    onSubmit={handleSubmit}
                    autoComplete="off" 
                    className="p-6 flex flex-col justify-center">

                    {/* zeroeth */}
                    <div className="flex flex-row">
                        <label htmlFor="people" className="text-2xl font-semibold text-[#5c5c61] mt-3 mx-8 mb-3">
                            Total number of people in your household : 
                        </label>

                        <input
                            type="number"
                            name="people"
                            id="people"
                            value={people}
                            placeholder="total number of people"
                            onChange={(event) => setPeople(event.target.value)}
                            className="w-[400px] mb-2 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-green-500 focus:outline-none"
                        />
                    </div>

                        
                    {/* first */}
                    <div className="flex flex-row">
                        {/* Collect data on electricity, heating, and cooling usage. */}
                        <label htmlFor="energy" className="text-2xl font-semibold text-[#5c5c61] mt-3 mx-8">
                            Total energy usage by your household (in kWh) : 
                        </label>

                        <input
                            type="number"
                            name="energy"
                            id="energy"
                            value={energyUsage}
                            placeholder="Energy Usage"
                            onChange={(event) => setEnergyUsage(event.target.value)}
                            className="w-[400px] mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-green-500 focus:outline-none"
                        />
                    </div>

                    {/* second */}
                    <div className="flex flex-row mt-2">
                        {/* Gather data on vehicle type, fuel consumption, and distance traveled. */}
                        <label htmlFor="transport" className="text-2xl font-semibold text-[#5c5c61] mt-3 mx-8">
                            Total transportation energy taken by your household (in l) :
                        </label>
                        <input
                            type="number"
                            name="transport"
                            id="transport"
                            value={transportation}
                            placeholder="Transportation by any vehicle"
                            onChange={(event) => setTransportation(event.target.value)}
                            className="w-[400px] mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-green-500 focus:outline-none"
                        />
                    </div>

                    {/* third */}
                    <div className="flex flex-row mt-2">
                        {/* Include information on waste production and recycling habits. */}
                        <label htmlFor="waste" className="text-2xl font-semibold text-[#5c5c61] mt-3 mx-8">
                            Total carbon waste generated by your household (in kg) : 
                        </label>
                        <input
                            type="number"
                            name="waste"
                            id="waste"
                            value={wasteGeneration}
                            placeholder="Carbon waste generated"
                            onChange={(event) => setWasteGeneration(event.target.value)}
                            className="w-[400px] mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-green-500 focus:outline-none"
                        />
                    </div>

                    {/* fourth */}
                    <div className="flex flex-row mt-2">
                        {/* Gather information on food consumed  */}
                        <label htmlFor="food" className="text-2xl font-semibold text-[#5c5c61] mt-3 mx-8">
                            Total food consumption by your household (in kg) : 
                        </label>
                        <input
                            type="number"
                            name="food"
                            id="food"
                            value={foodConsumption}
                            placeholder="Food consumption"
                            onChange={(event) => setfoodConsumption(event.target.value)}
                            className="w-[400px] mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-green-500 focus:outline-none"
                        />
                    </div>

                    {/* fifth */}
                    <div className="flex flex-row mt-2">
                        {/* Include information on waste production and recycling habits. */}
                        <label htmlFor="water" className="text-2xl font-semibold text-[#5c5c61] mt-3 mx-8">
                            Total water usage by your household (in l) : 
                        </label>
                        <input
                            type="number"
                            name="water"
                            id="water"
                            value={waterUsage}
                            placeholder="Water usage"
                            onChange={(event) => setWaterUsage(event.target.value)}
                            className="w-[400px] mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-green-500 focus:outline-none"
                        />
                    </div>

                    {/* <Link
                    to='/result'
                    > */}
                        <button
                            type="submit"
                            onClick={calculateCarbonFootprint}
                            className="md:w-32 bg-green-700 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-8 ml-[450px] hover:bg-green-600 transition ease-in-out duration-300"
                        >
                            Calculate
                        </button>
                    {/* </Link> */}

                    {carbonFootprintCalculated !== null && (
                        <div>
                            <h2>
                                Total Carbon Footprint of your household : {carbonFootprintCalculated.toFixed(2)} kg C0<sub>2</sub>e
                            </h2>
                        </div>
                    )}
                </form>

            </div>

        </main>
    )
}

export default Calculate_House