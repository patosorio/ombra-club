import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '../client/src/components/ui/card'
import { Calendar } from '../client/src/components/ui/calendar'
import { Button } from '../client/src/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../client/src/components/ui/tabs"
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from "../client/src/firebase/firebaseConfig"
import { getFirestore, doc, getDoc } from "firebase/firestore";

interface Shows {
    data: Shows;
}

const Shows = () => {
    const [shows, setShows] = useState([]);
    const [selectedShow, setSelectedShow] = useState(null);
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    
    
    useEffect(() => {
        const fetchShows = async () => {
            const showsCollectionRef = collection(db, "shows"); 
            const showsSnapshot = await getDocs(showsCollectionRef);
            const showsList = showsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShows(showsList);
        };

        fetchShows();
    }, []);
    
    return (
        <div className="flex flex-col h-full overflow-hidden">
                <div className="mb-4">
                    <h2 className="text-3xl tracking-tight">Shows</h2>
                </div>
                <div className="flex flex-col h-full overflow-hidden">
                    <Tabs>
                        <TabsList className="mb-4">
                            <TabsTrigger value="ShowList">Shows List</TabsTrigger>
                            <TabsTrigger value="ShowCalendar">Ombra Calendar</TabsTrigger>
                        </TabsList>
                        <TabsContent value="ShowList" className="space-y-4 overflow-auto">
                            <div className="grid lg:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    {shows.map((show) => (
                                        <div key={show.id} className="flex flex-row border p-4 mb-4 cursor-pointer" onClick={() => handleSelectShow(show)}>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="ShowCalendar" className="space-y-4">
                            <div className="grid">
                                <Card className="col-span-4">
                                    <CardContent>
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border"
                                    />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <div className="hidden lg:block">
                        IMAGE CARD
                    </div>
                </div>
                
        </div>
        // <div className="flex-1 space-y-4 p-8 pt-6 overflow-hidden">
        //         <div className="flex items-center justify-between space-y-2">
        //             <h2 className="text-3xl tracking-tight">Shows</h2>
        //         </div>
        //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-full overflow-hidden">
        //             <Tabs>
        //                 <TabsList className="mb-4">
        //                     <TabsTrigger value="ShowList">
        //                         Shows List
        //                     </TabsTrigger>
        //                     <TabsTrigger value="ShowCalendar">
        //                         Ombra Calendar
        //                     </TabsTrigger>
        //                 </TabsList>
        //                 <TabsContent value="ShowList" className="space-y-4">
        //                     <div className="grid">
        //                         <Card className="col-span-4">
        //                             <CardContent>
        //                                 <div className="flex flex-row border p-4 mb-4">
        //                                     <div className="ml-4 space-y-1">
        //                                         <img src={`${process.env.PUBLIC_URL}/img/logo/SVG/logo.svg`} alt="ombra logo" width="100" height="100"/>
        //                                     </div>
        //                                     <div className="ml-4 space-y-2">
        //                                         <p>SHOW NAME</p>
        //                                         <p>DESCRIPTION</p>
        //                                         <p>REVEAL LOCATION</p>
        //                                         <Button>Get Tickets</Button>
        //                                     </div>
        //                                 </div>
        //                                 <div className="flex flex-row border p-4 mb-4">
        //                                     <div className="ml-4 space-y-1">
        //                                         <img src={`${process.env.PUBLIC_URL}/img/logo/SVG/logo.svg`} alt="ombra logo" width="100" height="100"/>
        //                                     </div>
        //                                     <div className="ml-4 space-y-1">
        //                                         <p>SHOW NAME</p>
        //                                         <p>DESCRIPTION</p>
        //                                         <p>REVEAL LOCATION</p>
        //                                         <Button>Get Tickets</Button>
        //                                     </div>
        //                                 </div>
        //                                 <div className="flex flex-row border p-4 mb-4">
        //                                     <div className="ml-4 space-y-1">
        //                                         <img src={`${process.env.PUBLIC_URL}/img/logo/SVG/logo.svg`} alt="ombra logo" width="100" height="100"/>
        //                                     </div>
        //                                     <div className="ml-4 space-y-1">
        //                                         <p>SHOW NAME</p>
        //                                         <p>DESCRIPTION</p>
        //                                         <p>REVEAL LOCATION</p>
        //                                         <Button>Get Tickets</Button>
        //                                     </div>
        //                                 </div>
                                        
        //                             </CardContent>
        //                         </Card>
        //                     </div>
        //                 </TabsContent>
        //                 <TabsContent value="ShowCalendar" className="space-y-4">
        //                     <div className="grid">
        //                         <Card className="col-span-4">
        //                             <CardContent>
        //                             <Calendar
        //                                 mode="single"
        //                                 selected={date}
        //                                 onSelect={setDate}
        //                                 className="rounded-md border"
        //                             />
        //                             </CardContent>
        //                         </Card>
        //                     </div>
        //                 </TabsContent>
        //             </Tabs>
        //             <div className="hidden lg:block">
        //                 IMAGE CARD
        //             </div>
        //         </div>
                
        // </div>
    )

}

export default Shows;