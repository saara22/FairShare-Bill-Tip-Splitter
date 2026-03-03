/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Receipt, 
  Plus, 
  Minus, 
  Share2, 
  History, 
  Calculator,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SplitHistory {
  id: string;
  total: number;
  tip: number;
  people: number;
  perPerson: number;
  date: string;
}

export default function App() {
  // State Model as per Task 3
  const [billAmount, setBillAmount] = useState<string>('');
  const [numPeople, setNumPeople] = useState<string>('2');
  const [tipPercentage, setTipPercentage] = useState<string>('15');
  const [roundUp, setRoundUp] = useState<boolean>(false);
  const [result, setResult] = useState<number>(0);
  const [historyList, setHistoryList] = useState<SplitHistory[]>([]);
  
  // UI State
  const [showHistory, setShowHistory] = useState(false);
  const [lastCalculation, setLastCalculation] = useState<{
    totalBill: number;
    totalTip: number;
  } | null>(null);

  const handleCalculate = () => {
    const bill = parseFloat(billAmount) || 0;
    const people = parseInt(numPeople) || 1;
    const tip = parseFloat(tipPercentage) || 0;

    const tipAmount = (bill * tip) / 100;
    const totalWithTip = bill + tipAmount;
    let perPerson = people > 0 ? totalWithTip / people : 0;

    if (roundUp) {
      perPerson = Math.ceil(perPerson);
    }

    setResult(perPerson);
    setLastCalculation({
      totalBill: totalWithTip,
      totalTip: tipAmount
    });
  };

  const handleSave = () => {
    if (result <= 0 || !lastCalculation) return;

    const newEntry: SplitHistory = {
      id: Math.random().toString(36).substr(2, 9),
      total: lastCalculation.totalBill,
      tip: lastCalculation.totalTip,
      people: parseInt(numPeople) || 1,
      perPerson: result,
      date: new Date().toLocaleString(),
    };

    setHistoryList([newEntry, ...historyList].slice(0, 10));
  };

  const handleClear = () => {
    setBillAmount('');
    setNumPeople('2');
    setTipPercentage('15');
    setRoundUp(false);
    setResult(0);
    setLastCalculation(null);
  };

  const shareSummary = () => {
    if (result <= 0 || !lastCalculation) return;
    const text = `FairShare Summary:\nBill: $${parseFloat(billAmount).toFixed(2)}\nTip (${tipPercentage}%): $${lastCalculation.totalTip.toFixed(2)}\nTotal: $${lastCalculation.totalBill.toFixed(2)}\nSplit between ${numPeople} people: $${result.toFixed(2)} each.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'FairShare Bill Split',
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Summary copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 sm:py-12">
      <header className="w-full max-w-md mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Calculator className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">FairShare</h1>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 rounded-full hover:bg-slate-200 transition-colors relative"
        >
          <History className="w-6 h-6 text-slate-600" />
          {historyList.length > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-50"></span>
          )}
        </button>
      </header>

      <main className="w-full max-w-md space-y-6">
        {/* Main Screen: Input Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="space-y-5">
            {/* Bill Amount TextField */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                Bill Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">
                  $
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-10 pr-4 text-2xl font-bold text-slate-900 input-focus"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tip % TextField */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Tip %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={tipPercentage}
                    onChange={(e) => setTipPercentage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-lg font-bold text-slate-900 input-focus"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    %
                  </span>
                </div>
              </div>
              {/* Number of People TextField */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  People
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={numPeople}
                    onChange={(e) => setNumPeople(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-lg font-bold text-slate-900 input-focus"
                  />
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Round Up Switch */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${roundUp ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Round Up</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">To nearest dollar</p>
                </div>
              </div>
              <button 
                onClick={() => setRoundUp(!roundUp)}
                className={`w-12 h-6 rounded-full transition-colors relative ${roundUp ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <motion.div 
                  animate={{ x: roundUp ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            {/* Button List: Calculate, Save, Clear */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <button 
                onClick={handleCalculate}
                className="col-span-2 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-blue-900/10"
              >
                Calculate
              </button>
              <button 
                onClick={handleClear}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Result Text Section */}
        <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Receipt className="w-32 h-32 rotate-12" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="text-center">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Per Person</p>
              <h2 className="text-6xl font-bold tracking-tighter">
                <span className="text-3xl font-medium text-blue-400 mr-1">$</span>
                {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>

            {lastCalculation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10"
              >
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Total Bill</p>
                  <p className="text-xl font-bold">${lastCalculation.totalBill.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Total Tip</p>
                  <p className="text-xl font-bold text-blue-400">${lastCalculation.totalTip.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3 pt-4">
              <button 
                onClick={handleSave}
                disabled={result <= 0}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Save Split
              </button>
              <button 
                onClick={shareSummary}
                disabled={result <= 0}
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* History Screen: LazyColumn showing saved splits */}
        <AnimatePresence>
          {showHistory && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  Recent Splits
                </h3>
                {historyList.length > 0 && (
                  <button 
                    onClick={() => setHistoryList([])}
                    className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {historyList.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm">No recent splits yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {historyList.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <div>
                        <p className="text-sm font-bold text-slate-900">${item.total.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                          {item.people} people • {item.date.split(',')[0]}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">${item.perPerson.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">Per Person</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-auto pt-12 text-center">
        <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">
          Crafted for groups • FairShare v1.1
        </p>
      </footer>
    </div>
  );
}
