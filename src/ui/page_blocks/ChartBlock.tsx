import useFetch from 'src/hooks/useFetch';
import { BarChart } from '../components/Chart';
import { useToastContext } from '../providers/toast';
import { useEffect, useState } from 'react';

interface ChartData {
  datasetOne: number[];
  datasetTwo: number[];
}

export function ChartBlock() {
  const { renderToast } = useToastContext();
  const { data, error } = useFetch<ChartData>('http://localhost:3001/api/data/chart-data');

  const [originalData, setOriginalData] = useState<ChartData | null>(null);
  const [filteredData, setFilteredData] = useState<ChartData | null>(null);
  const [minValue, setMinValue] = useState<number | ''>('');
  const [maxValue, setMaxValue] = useState<number | ''>('');

  useEffect(() => {
    if (data) {
      setOriginalData(data);
      setFilteredData(data);
      renderToast('success', 'Data fetched successfully!');
    }

    if (error) {
      renderToast('error', 'Error fetching data!');
    }
  }, [data, error, renderToast]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : '';
    setMinValue(value);
    filterData(value, maxValue);

    if (typeof value === 'number' && typeof maxValue === 'number' && value > maxValue) {
      renderToast('error', 'Minimum value cannot be greater than maximum value!');
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : '';
    setMaxValue(value);
    filterData(minValue, value);

    if (typeof value === 'number' && typeof minValue === 'number' && value < minValue) {
      renderToast('error', 'Maximum value cannot be less than minimum value!');
    }
  };

  const filterData = (min: number | '', max: number | '') => {
    if (!originalData) return;

    const minNum = typeof min === 'number' ? min : -Infinity;
    const maxNum = typeof max === 'number' ? max : Infinity;

    const filteredDatasetOne = originalData.datasetOne.filter(value => value >= minNum && value <= maxNum);
    const filteredDatasetTwo = originalData.datasetTwo.filter(value => value >= minNum && value <= maxNum);

    setFilteredData({
      datasetOne: filteredDatasetOne,
      datasetTwo: filteredDatasetTwo,
    });
  };

  const handleReset = () => {
    setMinValue('');
    setMaxValue('');
    setFilteredData(originalData);
  };

  return (
    <div>
      <div className='mb-12 flex items-center'>
        <div className='flex flex-col mx-4'>
          <span className='text-sm'>Min</span>
          <input type='number' className='w-24 h-8 text-sm' value={minValue} onChange={handleMinChange} />
        </div>
        <div className='flex flex-col mx-4'>
          <span className='text-sm'>Max</span>
          <input type='number' className='w-24 h-8 text-sm' value={maxValue} onChange={handleMaxChange} />
        </div>
        <div className='flex flex-col mx-4 pt-4 w-100'>
          <button
            className='bg-blue-600 flex justify-center items-center h-10 text-center text-white border focus:outline-none focus:ring-4 font-sm rounded-lg text-sm px-5 py-1.9'
            onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
      <div>
        <BarChart
          width={600}
          height={300}
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
              {
                label: 'Dataset 1',
                data: filteredData ? filteredData.datasetOne : [],
                backgroundColor: 'rgb(255, 99, 132)',
              },
              {
                label: 'Dataset 2',
                data: filteredData ? filteredData.datasetTwo : [],
                backgroundColor: 'rgb(54, 162, 235)',
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
