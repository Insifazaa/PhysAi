
import React, { useState, useEffect } from 'react';
import type { DraftedOrderSet, DraftedOrder } from '../types';
import {
    ClipboardListIcon,
    InfoIcon,
    AlertTriangleIcon,
    BeakerIcon,
    FilmIcon,
    DocumentTextIcon,
} from './icons';

const categoryIcons: Record<DraftedOrder['orderCategory'], React.FC<{className?: string}>> = {
    Lab: BeakerIcon,
    Imaging: FilmIcon,
    Medication: (props) => <span {...props}>Rx</span>,
    Other: ClipboardListIcon,
};

const DraftOrderCard: React.FC<{ order: DraftedOrder; isConfirmed: boolean; onConfirm: () => void; }> = ({ order, isConfirmed, onConfirm }) => {
    const IconComponent = categoryIcons[order.orderCategory] || DocumentTextIcon;
    return (
        <div className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all duration-300 ${isConfirmed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-slate-500" />
                    <h4 className="font-semibold text-slate-800">{order.orderName}</h4>
                    {order.priority === 'Stat' && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                           <AlertTriangleIcon className="w-3 h-3" /> STAT
                        </span>
                    )}
                </div>
                {order.details && (
                    <p className="text-sm text-slate-600 mt-1 pl-8">{order.details}</p>
                )}
            </div>
            <div className="flex-shrink-0">
                <button 
                    onClick={onConfirm}
                    disabled={isConfirmed}
                    className={`w-full md:w-auto px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 flex items-center justify-center gap-2
                    ${isConfirmed 
                        ? 'bg-green-600 text-white cursor-default' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                >
                    {isConfirmed ? (
                        <>
                            <ShieldCheckIcon className="w-4 h-4" /> Confirmed
                        </>
                    ) : 'Confirm Order'}
                </button>
            </div>
        </div>
    );
};

const ShieldCheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const DraftOrdersDisplay: React.FC<{ resultSet: DraftedOrderSet }> = ({ resultSet }) => {
    const [confirmedOrders, setConfirmedOrders] = useState<Record<number, boolean>>({});

    useEffect(() => {
        // Reset confirmation state when a new result set is displayed
        setConfirmedOrders({});
    }, [resultSet.analysisId]);

    const handleConfirm = (index: number) => {
        setConfirmedOrders(prev => ({...prev, [index]: true}));
    };
    
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900">Drafted Clinical Orders</h2>
                <p className="text-sm text-slate-600 mt-2">The following orders were detected in the conversation for your review and confirmation.</p>
                <blockquote className="mt-4 border-l-4 border-slate-200 pl-4 text-sm italic text-slate-700">
                    "{resultSet.conversationSnippet}"
                </blockquote>
            </div>

            {/* Drafted Orders List */}
            {resultSet.draftedOrders.length > 0 ? (
                <div className="space-y-3">
                    {resultSet.draftedOrders.map((order, i) => (
                        <DraftOrderCard 
                            key={i}
                            order={order} 
                            isConfirmed={!!confirmedOrders[i]}
                            onConfirm={() => handleConfirm(i)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 px-6 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-600">No specific clinical orders were detected in the conversation.</p>
                </div>
            )}
            

            {/* Provenance Footer */}
            <div className="text-center text-xs text-slate-500 mt-6 p-3 bg-slate-100 rounded-md flex items-center justify-center gap-2 flex-wrap">
                <InfoIcon className="w-4 h-4" />
                <span><span className="font-semibold">Analysis ID:</span> {resultSet.analysisId}</span>
                <span className="text-slate-300 hidden md:inline">|</span>
                <span><span className="font-semibold">Generated:</span> {new Date(resultSet.timestamp).toLocaleString()}</span>
                <span className="text-slate-300 hidden md:inline">|</span>
                <span><span className="font-semibold">Model:</span> {resultSet.modelUsed}</span>
            </div>
        </div>
    );
};

export default DraftOrdersDisplay;
