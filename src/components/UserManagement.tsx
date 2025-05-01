
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Search, UserPlus, Users, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "inactive";
  avatarUrl?: string;
  initials: string;
  team?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: number;
  lead: string;
}

const SAMPLE_USERS: User[] = [
  { id: "u1", name: "John Smith", email: "john.smith@company.com", role: "Admin", status: "active", initials: "JS", team: "Product" },
  { id: "u2", name: "Alex Johnson", email: "alex.j@company.com", role: "Developer", status: "active", initials: "AJ", team: "Engineering" },
  { id: "u3", name: "Maria Garcia", email: "maria.g@company.com", role: "Designer", status: "active", initials: "MG", team: "Design" },
  { id: "u4", name: "Tyler Smith", email: "tyler.s@company.com", role: "DevOps", status: "active", initials: "TS", team: "Engineering" },
  { id: "u5", name: "Sam Wong", email: "sam.w@company.com", role: "Developer", status: "active", initials: "SW", team: "Engineering" },
  { id: "u6", name: "Jamie Lee", email: "jamie.l@company.com", role: "Data Scientist", status: "active", initials: "JL", team: "ML" },
  { id: "u7", name: "Robin Chen", email: "robin.c@company.com", role: "Manager", status: "active", initials: "RC", team: "Product" },
  { id: "u8", name: "Pat Wilson", email: "pat.w@company.com", role: "Designer", status: "invited", initials: "PW" },
];

const SAMPLE_TEAMS: Team[] = [
  { id: "t1", name: "Engineering", description: "Backend and frontend developers", members: 3, lead: "Alex Johnson" },
  { id: "t2", name: "Product", description: "Product managers and owners", members: 2, lead: "Robin Chen" },
  { id: "t3", name: "Design", description: "UI/UX designers", members: 1, lead: "Maria Garcia" },
  { id: "t4", name: "ML", description: "Machine learning and data scientists", members: 1, lead: "Jamie Lee" },
];

export function UserManagement() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [newTeamDialogOpen, setNewTeamDialogOpen] = React.useState(false);
  
  const filteredUsers = SAMPLE_USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Users</CardTitle>
                <div className="flex space-x-2">
                  <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-devops-purple hover:bg-devops-purple-dark">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Invite User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite New User</DialogTitle>
                        <DialogDescription>
                          Send an invitation to join your DevFlow workspace.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" placeholder="user@example.com" type="email" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Name (optional)</Label>
                          <Input id="name" placeholder="User's name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select defaultValue="developer">
                            <SelectTrigger id="role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="developer">Developer</SelectItem>
                              <SelectItem value="designer">Designer</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="team">Team (optional)</Label>
                          <Select>
                            <SelectTrigger id="team">
                              <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                            <SelectContent>
                              {SAMPLE_TEAMS.map(team => (
                                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-devops-purple hover:bg-devops-purple-dark" onClick={() => setInviteDialogOpen(false)}>
                          Send Invite
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              {user.avatarUrl ? (
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                              ) : (
                                <AvatarFallback className="bg-devops-purple-light text-white text-xs">
                                  {user.initials}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.team || "-"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${user.status === "active" ? "bg-devops-green/20 border-devops-green text-devops-green" : ""} 
                              ${user.status === "invited" ? "bg-devops-yellow/20 border-devops-yellow text-devops-yellow" : ""}
                              ${user.status === "inactive" ? "bg-devops-gray/20 border-devops-gray text-devops-gray" : ""}
                            `}
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                              <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "active" ? (
                                <DropdownMenuItem className="text-devops-red">Deactivate User</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Activate User</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Teams</CardTitle>
                <Dialog open={newTeamDialogOpen} onOpenChange={setNewTeamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-devops-purple hover:bg-devops-purple-dark">
                      <Plus className="h-4 w-4 mr-1" />
                      New Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Team</DialogTitle>
                      <DialogDescription>
                        Create a new team and assign members to it.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input id="teamName" placeholder="e.g. Frontend Team" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teamDescription">Description</Label>
                        <Input id="teamDescription" placeholder="What does this team do?" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teamLead">Team Lead</Label>
                        <Select>
                          <SelectTrigger id="teamLead">
                            <SelectValue placeholder="Select a lead" />
                          </SelectTrigger>
                          <SelectContent>
                            {SAMPLE_USERS
                              .filter(user => user.status === "active")
                              .map(user => (
                                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewTeamDialogOpen(false)}>Cancel</Button>
                      <Button className="bg-devops-purple hover:bg-devops-purple-dark" onClick={() => setNewTeamDialogOpen(false)}>
                        Create Team
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Team Lead</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SAMPLE_TEAMS.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>
                          <div className="font-medium">{team.name}</div>
                        </TableCell>
                        <TableCell>{team.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{team.members}</span>
                          </div>
                        </TableCell>
                        <TableCell>{team.lead}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Team</DropdownMenuItem>
                              <DropdownMenuItem>Edit Team</DropdownMenuItem>
                              <DropdownMenuItem>Manage Members</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-devops-red">Delete Team</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Roles & Permissions</CardTitle>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  Edit Permissions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Access Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Admin</div>
                      </TableCell>
                      <TableCell>Full access to all features and settings</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>
                        <Badge className="bg-devops-purple/80 text-white">Full Access</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Manager</div>
                      </TableCell>
                      <TableCell>Can manage teams, epics, and view all reports</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-devops-blue/20 border-devops-blue text-devops-blue">High</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Developer</div>
                      </TableCell>
                      <TableCell>Can update tasks and create reports</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-devops-green/20 border-devops-green text-devops-green">Medium</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Designer</div>
                      </TableCell>
                      <TableCell>Can update tasks and view designs</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-devops-green/20 border-devops-green text-devops-green">Medium</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Viewer</div>
                      </TableCell>
                      <TableCell>Can view tasks and reports</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-devops-gray/20 border-devops-gray text-devops-gray">Low</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
