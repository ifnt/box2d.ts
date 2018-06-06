/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["../../Common/b2Settings", "../../Common/b2Math"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2JointType, b2LimitState, b2Jacobian, b2JointEdge, b2JointDef, b2Joint;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            }
        ],
        execute: function () {
            (function (b2JointType) {
                b2JointType[b2JointType["e_unknownJoint"] = 0] = "e_unknownJoint";
                b2JointType[b2JointType["e_revoluteJoint"] = 1] = "e_revoluteJoint";
                b2JointType[b2JointType["e_prismaticJoint"] = 2] = "e_prismaticJoint";
                b2JointType[b2JointType["e_distanceJoint"] = 3] = "e_distanceJoint";
                b2JointType[b2JointType["e_pulleyJoint"] = 4] = "e_pulleyJoint";
                b2JointType[b2JointType["e_mouseJoint"] = 5] = "e_mouseJoint";
                b2JointType[b2JointType["e_gearJoint"] = 6] = "e_gearJoint";
                b2JointType[b2JointType["e_wheelJoint"] = 7] = "e_wheelJoint";
                b2JointType[b2JointType["e_weldJoint"] = 8] = "e_weldJoint";
                b2JointType[b2JointType["e_frictionJoint"] = 9] = "e_frictionJoint";
                b2JointType[b2JointType["e_ropeJoint"] = 10] = "e_ropeJoint";
                b2JointType[b2JointType["e_motorJoint"] = 11] = "e_motorJoint";
                b2JointType[b2JointType["e_areaJoint"] = 12] = "e_areaJoint";
            })(b2JointType || (b2JointType = {}));
            exports_1("b2JointType", b2JointType);
            (function (b2LimitState) {
                b2LimitState[b2LimitState["e_inactiveLimit"] = 0] = "e_inactiveLimit";
                b2LimitState[b2LimitState["e_atLowerLimit"] = 1] = "e_atLowerLimit";
                b2LimitState[b2LimitState["e_atUpperLimit"] = 2] = "e_atUpperLimit";
                b2LimitState[b2LimitState["e_equalLimits"] = 3] = "e_equalLimits";
            })(b2LimitState || (b2LimitState = {}));
            exports_1("b2LimitState", b2LimitState);
            b2Jacobian = class b2Jacobian {
                constructor() {
                    this.linear = new b2Math_1.b2Vec2();
                    this.angularA = 0;
                    this.angularB = 0;
                }
                SetZero() {
                    this.linear.SetZero();
                    this.angularA = 0;
                    this.angularB = 0;
                    return this;
                }
                Set(x, a1, a2) {
                    this.linear.Copy(x);
                    this.angularA = a1;
                    this.angularB = a2;
                    return this;
                }
            };
            exports_1("b2Jacobian", b2Jacobian);
            /// A joint edge is used to connect bodies and joints together
            /// in a joint graph where each body is a node and each joint
            /// is an edge. A joint edge belongs to a doubly linked list
            /// maintained in each attached body. Each joint has two joint
            /// nodes, one for each attached body.
            b2JointEdge = class b2JointEdge {
                constructor(joint, other) {
                    this.prev = null; ///< the previous joint edge in the body's joint list
                    this.next = null; ///< the next joint edge in the body's joint list
                    this.joint = joint;
                    this.other = other;
                }
            };
            exports_1("b2JointEdge", b2JointEdge);
            /// Joint definitions are used to construct joints.
            b2JointDef = class b2JointDef {
                constructor(type) {
                    /// The joint type is set automatically for concrete joint types.
                    this.type = b2JointType.e_unknownJoint;
                    /// Use this to attach application specific data to your joints.
                    this.userData = null;
                    /// Set this flag to true if the attached bodies should collide.
                    this.collideConnected = false;
                    this.type = type;
                }
            };
            exports_1("b2JointDef", b2JointDef);
            /// The base joint class. Joints are used to constraint two bodies together in
            /// various fashions. Some joints also feature limits and motors.
            b2Joint = class b2Joint {
                constructor(def) {
                    ///b2Assert(def.bodyA !== def.bodyB);
                    this.m_type = b2JointType.e_unknownJoint;
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_index = 0;
                    this.m_islandFlag = false;
                    this.m_collideConnected = false;
                    this.m_userData = null;
                    this.m_type = def.type;
                    this.m_edgeA = new b2JointEdge(this, def.bodyB);
                    this.m_edgeB = new b2JointEdge(this, def.bodyA);
                    this.m_bodyA = def.bodyA;
                    this.m_bodyB = def.bodyB;
                    this.m_collideConnected = b2Settings_1.b2Maybe(def.collideConnected, false);
                    this.m_userData = def.userData;
                }
                /// Get the type of the concrete joint.
                GetType() {
                    return this.m_type;
                }
                /// Get the first body attached to this joint.
                GetBodyA() {
                    return this.m_bodyA;
                }
                /// Get the second body attached to this joint.
                GetBodyB() {
                    return this.m_bodyB;
                }
                /// Get the next joint the world joint list.
                GetNext() {
                    return this.m_next;
                }
                /// Get the user data pointer.
                GetUserData() {
                    return this.m_userData;
                }
                /// Set the user data pointer.
                SetUserData(data) {
                    this.m_userData = data;
                }
                /// Short-cut function to determine if either body is inactive.
                IsActive() {
                    return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
                }
                /// Get collide connected.
                /// Note: modifying the collide connect flag won't work correctly because
                /// the flag is only checked when fixture AABBs begin to overlap.
                GetCollideConnected() {
                    return this.m_collideConnected;
                }
                /// Dump this joint to the log file.
                Dump(log) {
                    log("// Dump is not supported for this joint type.\n");
                }
                /// Shift the origin for any points stored in world coordinates.
                ShiftOrigin(newOrigin) {
                }
            };
            exports_1("b2Joint", b2Joint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJKb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIySm9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQU9GLFdBQVksV0FBVztnQkFDckIsaUVBQWtCLENBQUE7Z0JBQ2xCLG1FQUFtQixDQUFBO2dCQUNuQixxRUFBb0IsQ0FBQTtnQkFDcEIsbUVBQW1CLENBQUE7Z0JBQ25CLCtEQUFpQixDQUFBO2dCQUNqQiw2REFBZ0IsQ0FBQTtnQkFDaEIsMkRBQWUsQ0FBQTtnQkFDZiw2REFBZ0IsQ0FBQTtnQkFDaEIsMkRBQWUsQ0FBQTtnQkFDZixtRUFBbUIsQ0FBQTtnQkFDbkIsNERBQWdCLENBQUE7Z0JBQ2hCLDhEQUFpQixDQUFBO2dCQUNqQiw0REFBZ0IsQ0FBQTtZQUNsQixDQUFDLEVBZFcsV0FBVyxLQUFYLFdBQVcsUUFjdEI7O1lBRUQsV0FBWSxZQUFZO2dCQUN0QixxRUFBbUIsQ0FBQTtnQkFDbkIsbUVBQWtCLENBQUE7Z0JBQ2xCLG1FQUFrQixDQUFBO2dCQUNsQixpRUFBaUIsQ0FBQTtZQUNuQixDQUFDLEVBTFcsWUFBWSxLQUFaLFlBQVksUUFLdkI7O1lBRUQsYUFBQTtnQkFBQTtvQkFDa0IsV0FBTSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ3ZDLGFBQVEsR0FBVyxDQUFDLENBQUM7b0JBQ3JCLGFBQVEsR0FBVyxDQUFDLENBQUM7Z0JBZTlCLENBQUM7Z0JBYlEsT0FBTztvQkFDWixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRU0sR0FBRyxDQUFDLENBQUssRUFBRSxFQUFVLEVBQUUsRUFBVTtvQkFDdEMsSUFBSSxDQUFDLE1B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