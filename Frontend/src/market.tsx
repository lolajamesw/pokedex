"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Textarea } from "./components/ui/textarea"
import { Badge } from "./components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"
import { MessageSquare, Plus, Eye } from "lucide-react"
import "./market.css"
import { Description } from "@radix-ui/react-dialog"

type pokemonType = {
    id: number,
    nickname: string,
    name: string,
    type: string,
    level: number,
    image: string,
}

type ReplyType = {
  id: number,
  userAvatar: string,
  userName: string,
  pokemon: pokemonType,
  message: string
}

type ListingType = {
    id: number,
    userId: number,
    userName: string,
    pokemon: pokemonType,
    description: string,
    replyCount: number
}

export default function PokemonMarket() {
  const [listings, setListings] = useState<ListingType[]>([])
  const [tabValue, setTabValue] = useState("browse");
  const [bannerMessage, setBannerMessage] = useState("");
  const [listablePokemon, setListablePokemon] = useState<pokemonType[]>([]);
  const [replyablePokemon, setReplyablePokemon] = useState<pokemonType[]>([]);
  const [userListings, setUserListings] = useState<ListingType[]>([]);
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [selectedListing, setSelectedListing] = useState<ListingType|null>(null);
  const [replyListVis, setReplyListVis] = useState<boolean>(false);
  const [replyVis, setReplyVis] = useState<boolean>(false);
  const [newListing, setNewListing] = useState({
    pokemonId: "",
    description: "",
  })

  const [replyForm, setReplyForm] = useState({
    listingId: -1,
    pokemonId: "",
    message: "",
  })

  async function getListablePokemon(){
    fetch(`http://localhost:8081/listablePokemon/${localStorage.getItem("uID")}`)
      .then((res) => res.json())
      .then((data) => setListablePokemon(data))
      .catch((error) => console.error("There was a problem getting the pokemon available for listing.", error));
  }

  async function getReplyablePokemon(lid: number){
    fetch(`http://localhost:8081/replyablePokemon/uID=${localStorage.getItem("uID")}&listingID=${lid}`)
      .then((res) => res.json())
      .then((data) => setReplyablePokemon(data))
      .catch((error) => console.error("There was a problem getting the pokemon available for listing.", error));
  }

  async function getMyListings() {
    fetch(`http://localhost:8081/myListings/${localStorage.getItem("uID")}`)
        .then((res) => res.json())
        .then((data) => setUserListings(data))
        .catch((error) => console.error("There was a problem getting your listed pokemon", error));
  }

  async function getAvailableListings() {
    fetch(`http://localhost:8081/availableListings/${localStorage.getItem("uID")}`)
        .then((res)=>res.json())
        .then((data)=>setListings(data))
        .catch((err)=>console.error("Failed to fetch available listings"))
  }

  async function getReplies(listingID){
    await fetch(`http://localhost:8081/replies/${listingID}`)
      .then((res) => res.json())
      .then(async (data) => setReplies(data))
      .catch((error) => console.error("There was a problem getting the replies for this listing.", error));
  }

  //initial values
  useEffect(() => {
    getMyListings();
  }, [])

  useEffect(() => {
    switch (tabValue){
      case "browse":
        getAvailableListings();
        break;
      case "my-listings":
        getMyListings();
        break;
      case "create":
        getListablePokemon();
        break;
      default:
        console.error("Invalid tab name:", tabValue);
        break;
    }
  }, [tabValue]);

  useEffect(() => {

  })

  const handleCreateListing = async () => {
    
    try {
      const response = await fetch("http://localhost:8081/listPokemon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iid: newListing.pokemonId,
          uid: localStorage.getItem("uID"),
          desc: newListing.description
        }),
      });

      if (response.ok) {
        const data = await response.json();

        //display confirmation message
        setBannerMessage(
          "Your pokemon has been posted for trading."
        );
        setTimeout(() => setBannerMessage(""), 4000);

        //clear the data we've already entered
        setNewListing({pokemonId: "", description: ""});

        //switch to the myListings tab to see the newly created listing
        setTabValue("my-listings");

      } else {
        const errMsg = await response.text();
        console.error("Failed to create listing:", errMsg);
      }
    } catch (err) {
      console.error("Error creating listing:", err);
      alert("Something went wrong during trade listing.");
    }

  }

  const handleReply = async () => {
    console.log("handling reply");
    if (!replyForm.pokemonId) return

    try {
      const response = await fetch("http://localhost:8081/reply", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          instanceID: replyForm.pokemonId,
          listingID: replyForm.listingId,
          respondantID: localStorage.getItem("uID"),
          message: replyForm.message,
        })
      });

      if (response.ok){
        const data = await response.json();

        //display confirmation message
        setBannerMessage(
          "Trade offer sent"
        );
        setTimeout(() => setBannerMessage(""), 4000);

        setReplyVis(false);
        setReplyForm({ listingId: -1, pokemonId: "", message: "" })
      } else {
        const errMsg = await response.text();
        console.error("Failed to create reply:", errMsg);
      }
    } catch (err) {
      console.error("Error creating reply:", err);
      alert("Something went wrong during trade reply.");
    }

  }

  const handleTrade = async (reply: ReplyType) => {
    console.log("handling trade");

    try {
      const response = await fetch("http://localhost:8081/trade", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          replyID: reply.id
        })
      });

      console.log(response);

      if (response.status == 201){
        // display confirmation message

        setBannerMessage(
          // TODO: fix selectedListing.pokemon.nickname is undefined
          // `Congratulations! You traded a level ${selectedListing?.pokemon.level} ${selectedListing?.pokemon.name} named ${selectedListing?.pokemon.nickname} for a level ${reply.pokemon.level} ${reply.pokemon.name} named ${reply.pokemon.nickname}!
          // ${reply.pokemon.nickname} has been added to your collection.`
          "Trade complete"
        );
        setTimeout(() => setBannerMessage(""), 4000);

        setReplyListVis(false);
        getMyListings(); //to get the updated list without the pokemon we just traded.
        
      } else {
        const errMsg = await response.text();
        console.error("Failed to create reply:", errMsg);
      }
    } catch (err) {
      console.error("Error creating reply:", err);
      alert("Something went wrong during trade reply.");
    }
  }

  


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="container  mx-auto p-6 max-w-6xl">
        {bannerMessage && (
          <div className="banner">
            <p>{bannerMessage}</p>
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 header">Pokemon Market</h1>
          <p className="text-muted-foreground header">Trade your Pokemon with other trainers</p>
        </div>

        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Listings</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings ({userListings.length})</TabsTrigger>
            <TabsTrigger value="create">Create Listing</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <div className="grid gap-4">
              {listings.map((listing) => (
                <Card key={listing.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          {/* <AvatarImage src={listing.userAvatar || "/placeholder.svg"} /> */}
                          <AvatarFallback>{listing.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{listing.userName}</CardTitle>
                          {/* <CardDescription>{listing.createdAt}</CardDescription> */}
                        </div>
                      </div>
                      <Badge variant="secondary">{listing.replyCount} replies</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={listing.pokemon.image || "/placeholder.svg"}
                          alt={listing.pokemon.name}
                          className="w-20 h-20 rounded-lg border"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{listing.pokemon.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {listing.pokemon.type} • Level {listing.pokemon.level}
                        </p>
                        <p className="text-sm mb-4">{listing.description}</p>

                        <Dialog open={replyVis} onOpenChange={setReplyVis}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => { getReplyablePokemon(listing.id); setReplyForm({ ...replyForm, listingId: listing.id })}}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Reply to Listing
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Reply to {listing.userName}
                                {"'"}s Listing
                              </DialogTitle>
                              <DialogDescription>
                                Offer one of your Pokemon in exchange for {listing.pokemon.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Select Pokemon to Offer</label>
                                <Select
                                  value={replyForm.pokemonId}
                                  onValueChange={(value) => setReplyForm({ ...replyForm, pokemonId: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a Pokemon" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {replyablePokemon.map((pokemon) => (
                                      <SelectItem key={pokemon.id} value={pokemon.id.toString()}>
                                        {!pokemon.nickname ? "" : pokemon.nickname+": "}{pokemon.name} (Level {pokemon.level})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Message</label>
                                <Textarea
                                  placeholder="Add a message with your offer..."
                                  value={replyForm.message}
                                  onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                                />
                              </div>
                              <Button onClick={handleReply} className="w-full" disabled={replyForm.pokemonId == ""}>
                                Send Reply
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-listings" className="space-y-4">
            {userListings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">You haven{"'"}t created any listings yet.</p>
                  <Button 
                    onClick={() => setTabValue("create")}
                    className="mt-4"> 
                    Create Your First Listing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userListings.map((listing) => (
                  <Card key={listing.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Your Listing</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{listing.replyCount} {listing.replyCount == 1 ? "reply" : "replies"}</Badge>
                          <Dialog open={replyListVis} onOpenChange={setReplyListVis}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={(e) => { getReplies(listing.id); setSelectedListing(listing); setReplyListVis(true);}}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Replies
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Replies to Your Listing</DialogTitle>
                                <DialogDescription>
                                  {selectedListing?.replyCount} trainers have replied to your {selectedListing?.pokemon.name} listing
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 max-h-96 overflow-y-auto">
                                {selectedListing?.replyCount === 0 ? ( 
                                  <p className="text-center text-muted-foreground py-8">No replies yet</p>
                                ) : (
                                  replies.map((reply) => (
                                    <Card key={reply.id}>
                                      <CardContent className="pt-4">
                                        <div className="flex items-start space-x-3">
                                          <Avatar>
                                            <AvatarImage src={reply.userAvatar || "/placeholder.svg"} />
                                            <AvatarFallback>{reply.userName[0]}</AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                              <span className="font-semibold">{reply.userName}</span>
                                              <span className="text-sm text-muted-foreground">offered</span>
                                              <span className="font-medium">{reply.pokemon.name}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                              {reply.pokemon.type} • Level {reply.pokemon.level}
                                            </p>
                                            <p className="text-sm">{reply.message}</p>
                                          </div>
                                          <img
                                            src={reply.pokemon.image || "/placeholder.svg"}
                                            alt={reply.pokemon.name}
                                            className="w-12 h-12 rounded border"
                                          />
                                          <Button onClick={() => handleTrade(reply)}>Accept</Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-4">
                        <img
                          src={listing.pokemon.image || "/placeholder.svg"}
                          alt={listing.pokemon.name}
                          className="w-20 h-20 rounded-lg border"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{listing.pokemon.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {listing.pokemon.type} • Level {listing.pokemon.level}
                          </p>
                          <p className="text-sm">{listing.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Listing</CardTitle>
                <CardDescription>Offer one of your Pokemon for trade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Pokemon to Trade</label>
                  <Select
                    value={newListing.pokemonId}
                    onValueChange={(value) => setNewListing({ ...newListing, pokemonId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a Pokemon" />
                    </SelectTrigger>
                    <SelectContent>
                      {listablePokemon.map((pokemon) => (
                        <SelectItem key={pokemon.id} value={pokemon.id.toString()}>
                          {!pokemon.nickname ? "" : pokemon.nickname+": "}{pokemon.name} (Level {pokemon.level}) - {pokemon.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {listablePokemon.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">All your Pokemon are already listed for trade</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">What are you looking for?</label>
                  <Textarea
                    placeholder="Describe what Pokemon you'd like in exchange..."
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleCreateListing}
                  disabled={!newListing.pokemonId || !newListing.description.trim()}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
